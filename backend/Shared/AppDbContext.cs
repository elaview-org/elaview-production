using ElaviewBackend.Shared.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Shared;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options) {
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Profile> Profiles { get; set; } = null!;
    public DbSet<AdvertiserProfile> AdvertiserProfiles { get; set; } = null!;
    public DbSet<SpaceOwnerProfile> SpaceOwnerProfiles { get; set; } = null!;
    public DbSet<Space> Spaces { get; set; } = null!;
    public DbSet<Campaign> Campaigns { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity => {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Role);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property<string>("ActiveProfileId")
                .HasMaxLength(50);

            entity.HasOne(e => e.ActiveProfile)
                .WithMany()
                .HasForeignKey("ActiveProfileId")
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Profile>(entity => {
            entity.ToTable("profiles");

            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.ProfileType);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<AdvertiserProfile>(entity => {
            entity.ToTable("advertiser_profiles");

            entity.Property<string>("ProfileId")
                .HasMaxLength(50)
                .IsRequired();
            entity.HasKey("ProfileId");

            entity.HasIndex(e => e.StripeAccountId);
            entity.HasIndex(e => e.StripeAccountStatus);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Profile)
                .WithOne()
                .HasForeignKey<AdvertiserProfile>("ProfileId")
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<SpaceOwnerProfile>(entity => {
            entity.ToTable("space_owner_profiles");

            entity.Property<string>("ProfileId")
                .HasMaxLength(50)
                .IsRequired();
            entity.HasKey("ProfileId");

            entity.HasIndex(e => e.StripeAccountId);
            entity.HasIndex(e => e.StripeAccountStatus);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Profile)
                .WithOne()
                .HasForeignKey<SpaceOwnerProfile>("ProfileId")
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Space>(entity => {
            entity.ToTable("spaces");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
            entity.HasIndex(e => new { e.City, e.State });
            entity.HasIndex(e => new { e.Type, e.Status });
            entity.HasIndex(e => new { e.Status, e.CreatedAt });
            entity.HasIndex(e => e.PricePerDay);
            entity.HasIndex(e => e.AverageRating);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.PricePerDay).HasPrecision(10, 2);
            entity.Property(e => e.InstallationFee).HasPrecision(10, 2);
            entity.Property(e => e.TotalRevenue).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property<string>("OwnerProfileId")
                .HasMaxLength(50)
                .IsRequired();

            entity.HasOne(e => e.SpaceOwner)
                .WithMany()
                .HasForeignKey("OwnerProfileId");
        });

        modelBuilder.Entity<Campaign>(entity => {
            entity.ToTable("campaigns");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => e.EndDate);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.TotalBudget).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.Property<string>("AdvertiserProfileId")
                .HasMaxLength(50)
                .IsRequired();

            entity.HasOne(e => e.Advertiser)
                .WithMany()
                .HasForeignKey("AdvertiserProfileId");
        });
    }
}