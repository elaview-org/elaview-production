using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace ElaviewBackend.Features.Shared.Errors;

public sealed class ErrorFilter(IWebHostEnvironment env) : IErrorFilter {
    public IError OnError(IError error) {
        if (error.Exception is DomainException domain)
            return BuildError(error, domain.Message, domain.Code);

        if (env.IsDevelopment())
            return error;

        return BuildError(error, "An unexpected error occurred.", "INTERNAL_ERROR");
    }

    private static IError BuildError(IError original, string message, string code) {
        var builder = ErrorBuilder.New()
            .SetMessage(message)
            .SetCode(code)
            .SetPath(original.Path);

        if (original.Locations is not null)
            foreach (var location in original.Locations)
                builder.AddLocation(location);

        return builder.Build();
    }
}