using CloudinaryDotNet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElaviewBackend.Features.Storage;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StorageController(Cloudinary cloudinary) : ControllerBase {
    [HttpPost("upload-signature")]
    public IActionResult GenerateUploadSignature(
        [FromBody] UploadSignatureRequest request) {
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        var parameters = new SortedDictionary<string, object> {
            { "timestamp", timestamp }
        };

        if (!string.IsNullOrEmpty(request.Folder))
            parameters["folder"] = request.Folder;

        if (!string.IsNullOrEmpty(request.PublicId))
            parameters["public_id"] = request.PublicId;

        if (request.Tags is { Length: > 0 })
            parameters["tags"] = string.Join(",", request.Tags);

        var signature = cloudinary.Api.SignParameters(parameters);

        return Ok(new UploadSignatureResponse(
            Signature: signature,
            Timestamp: timestamp,
            ApiKey: cloudinary.Api.Account.ApiKey,
            CloudName: cloudinary.Api.Account.Cloud,
            Folder: request.Folder,
            PublicId: request.PublicId));
    }
}
