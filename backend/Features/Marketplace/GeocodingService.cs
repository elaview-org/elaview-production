using System.Text.Json;
using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Settings;
using Microsoft.Extensions.Options;

namespace ElaviewBackend.Features.Marketplace;

public record GeocodingResult(double Latitude, double Longitude);

public interface IGeocodingService {
    Task<GeocodingResult> GeocodeAddressAsync(
        string address, string city, string state, string? zipCode, CancellationToken ct);
}

public sealed class GeocodingService(
    IHttpClientFactory httpClientFactory,
    IOptions<GlobalSettings> settings
) : IGeocodingService {
    private static readonly SemaphoreSlim RateLimiter = new(1, 1);
    private static DateTime _lastRequestTime = DateTime.MinValue;

    public async Task<GeocodingResult> GeocodeAddressAsync(
        string address, string city, string state, string? zipCode, CancellationToken ct) {
        var nominatimSettings = settings.Value.Nominatim;
        var fullAddress = BuildFullAddress(address, city, state, zipCode);

        await EnforceRateLimitAsync(nominatimSettings.RateLimitDelayMs, ct);

        using var client = httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(nominatimSettings.TimeoutSeconds);
        client.DefaultRequestHeaders.UserAgent.ParseAdd(nominatimSettings.UserAgent);

        var encodedAddress = Uri.EscapeDataString(fullAddress);
        var requestUrl = $"{nominatimSettings.BaseUrl}/search?q={encodedAddress}&format=json&limit=1";

        try {
            var response = await client.GetAsync(requestUrl, ct);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(ct);
            var results = JsonSerializer.Deserialize<List<NominatimResponse>>(content, JsonOptions);

            if (results is null || results.Count == 0)
                throw new GeocodingException(fullAddress, "No results found");

            var result = results[0];
            if (!double.TryParse(result.Lat, out var latitude) ||
                !double.TryParse(result.Lon, out var longitude))
                throw new GeocodingException(fullAddress, "Invalid coordinates in response");

            return new GeocodingResult(latitude, longitude);
        }
        catch (HttpRequestException ex) {
            throw new GeocodingException(fullAddress, ex.Message);
        }
        catch (TaskCanceledException ex) when (ex.InnerException is TimeoutException) {
            throw new GeocodingException(fullAddress, "Request timed out");
        }
        catch (JsonException) {
            throw new GeocodingException(fullAddress, "Invalid response format");
        }
    }

    private static string BuildFullAddress(string address, string city, string state, string? zipCode) {
        var parts = new List<string> { address, city, state };
        if (!string.IsNullOrWhiteSpace(zipCode))
            parts.Add(zipCode);
        return string.Join(", ", parts);
    }

    private static async Task EnforceRateLimitAsync(int delayMs, CancellationToken ct) {
        await RateLimiter.WaitAsync(ct);
        try {
            var timeSinceLastRequest = DateTime.UtcNow - _lastRequestTime;
            var remainingDelay = TimeSpan.FromMilliseconds(delayMs) - timeSinceLastRequest;
            if (remainingDelay > TimeSpan.Zero)
                await Task.Delay(remainingDelay, ct);
            _lastRequestTime = DateTime.UtcNow;
        }
        finally {
            RateLimiter.Release();
        }
    }

    private static readonly JsonSerializerOptions JsonOptions = new() {
        PropertyNameCaseInsensitive = true
    };

    private sealed class NominatimResponse {
        public string Lat { get; set; } = "";
        public string Lon { get; set; } = "";
    }
}
