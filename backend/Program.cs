var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services
    .AddOpenApi()
    .AddGraphQLServer()
    .AddTypes();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

app.MapGet("/", () => "Hello World!");
app.UseHttpsRedirection();
app.MapGraphQL();
app.Run();