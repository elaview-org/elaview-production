using ElaviewBackend.Data;
using ElaviewBackend.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services
    .Configure<GlobalSettings>(builder.Configuration)
    .AddDbContext<AppDbContext>((serviceProvider, options) => {
            options.LogTo(Console.WriteLine);
            options.UseNpgsql(serviceProvider
                .GetRequiredService<IOptions<GlobalSettings>>().Value.Database
                .GetConnectionString());
        }
    )
    .AddOpenApi()
    .AddGraphQLServer()
    .AddTypes();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

app.MapGet("/", () => "Hello World!");
app.UseHttpsRedirection();
app.MapGraphQL();
app.Run();