using ElaviewBackend.Shared.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Shared;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options) {
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<AdvertiserProfile> AdvertiserProfiles { get; set; } = null!;
    public DbSet<SpaceOwnerProfile> SpaceOwnerProfiles { get; set; } = null!;
    public DbSet<Space> Spaces { get; set; } = null!;
    public DbSet<Campaign> Campaigns { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);
        new UserConfig().Configure(modelBuilder.Entity<User>());
        new AdvertiserProfileConfig().Configure(modelBuilder
            .Entity<AdvertiserProfile>());
        new SpaceOwnerProfileConfig().Configure(modelBuilder
            .Entity<SpaceOwnerProfile>());
        new SpaceConfig().Configure(modelBuilder.Entity<Space>());
        new CampaignConfig().Configure(modelBuilder.Entity<Campaign>());
    }
}