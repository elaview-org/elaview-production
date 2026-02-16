namespace ElaviewBackend.Settings;

public class GlobalSettings {
    public DatabaseSettings Database { get; set; } = new();

    public CloudinarySettings Cloudinary { get; set; } = new();

    public NominatimSettings Nominatim { get; set; } = new();
}

public class DatabaseSettings {
    public string ConnectionString { get; set; } = "";

    public string Host { get; set; } = "";

    public string Port { get; set; } = "";

    public string User { get; set; } = "";

    public string Password { get; set; } = "";

    public string GetConnectionString() {
        if (!string.IsNullOrEmpty(ConnectionString))
            return ConnectionString;

        return
            $"Host={Host};Port={Port};Database={User};Username={User};Password={Password};Include Error Detail=true";
    }
}

public class CloudinarySettings {
    public string CloudName { get; set; } = "";

    public string ApiKey { get; set; } = "";

    public string ApiSecret { get; set; } = "";
}

public class NominatimSettings {
    public string BaseUrl { get; set; } = "https://nominatim.openstreetmap.org";

    public string UserAgent { get; set; } = "Elaview/1.0";

    public int TimeoutSeconds { get; set; } = 10;

    public int RateLimitDelayMs { get; set; } = 1000;
}