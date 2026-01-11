namespace ElaviewBackend.Shared;

public class GlobalSettings {
    public DatabaseSettings Database { get; set; } = new();
}

public class DatabaseSettings {
    public string Host { get; set; } = "";

    public string Port { get; set; } = "";

    public string User { get; set; } = "";

    public string Password { get; set; } = "";

    public string GetConnectionString() {
        return
            $"Host={Host};Port={Port};Database={User};Username={User};Password={Password};Include Error Detail=true";
    }
}