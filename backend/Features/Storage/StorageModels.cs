namespace ElaviewBackend.Features.Storage;

public sealed record UploadSignatureRequest(
    string? Folder,
    string? PublicId,
    string[]? Tags);

public sealed record UploadSignatureResponse(
    string Signature,
    long Timestamp,
    string ApiKey,
    string CloudName,
    string? Folder,
    string? PublicId);
