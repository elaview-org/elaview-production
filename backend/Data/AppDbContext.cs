using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options) {
    public DbSet<User> Users { get; set; }
    public DbSet<AdvertiserProfile> AdvertiserProfiles { get; set; }
    public DbSet<SpaceOwnerProfile> SpaceOwnerProfiles { get; set; }
    public DbSet<Space> Spaces { get; set; }
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<PlatformAnalytics> PlatformAnalytics { get; set; }
    public DbSet<StripeWebhookEvent> StripeWebhookEvents { get; set; }
    public DbSet<CronJobLog> CronJobLogs { get; set; }
    public DbSet<DemoRequest> DemoRequests { get; set; }
    public DbSet<BugReport> BugReports { get; set; }
    public DbSet<Lead> Leads { get; set; }
    public DbSet<OutreachLog> OutreachLogs { get; set; }
    public DbSet<ReferralPartner> ReferralPartners { get; set; }
    public DbSet<MarketResearch> MarketResearches { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        // User configuration
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
        });

        // AdvertiserProfile configuration
        modelBuilder.Entity<AdvertiserProfile>(entity => {
            entity.ToTable("advertiser_profiles");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.StripeCustomerId);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithOne(u => u.AdvertiserProfile)
                .HasForeignKey<AdvertiserProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // SpaceOwnerProfile configuration
        modelBuilder.Entity<SpaceOwnerProfile>(entity => {
            entity.ToTable("space_owner_profiles");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.StripeAccountId);
            entity.HasIndex(e => e.StripeAccountStatus);
            entity.HasIndex(e => e.AccountDisconnectedAt);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithOne(u => u.SpaceOwnerProfile)
                .HasForeignKey<SpaceOwnerProfile>(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Space configuration
        modelBuilder.Entity<Space>(entity => {
            entity.ToTable("spaces");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OwnerId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => new { e.Latitude, e.Longitude });
            entity.HasIndex(e => new { e.City, e.State });
            entity.HasIndex(e => new { e.Type, e.Status });
            entity.HasIndex(e => new { e.Status, e.CreatedAt });
            entity.HasIndex(e => e.PricePerDay);
            entity.HasIndex(e => e.AverageRating);
            entity.HasIndex(e => new { e.QuadtreeNodeId, e.QuadtreeDepth });
            entity.HasIndex(e => e.QuadtreeNodeId);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.PricePerDay).HasPrecision(10, 2);
            entity.Property(e => e.InstallationFee).HasPrecision(10, 2);
            entity.Property(e => e.TotalRevenue).HasPrecision(10, 2);
            entity.Property(e => e.QuadtreeNodeId).HasMaxLength(20);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Owner)
                .WithMany(u => u.OwnedSpaces)
                .HasForeignKey(e => e.OwnerId);
        });

        // Campaign configuration
        modelBuilder.Entity<Campaign>(entity => {
            entity.ToTable("campaigns");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.AdvertiserId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => new { e.AdvertiserId, e.Status });
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => e.EndDate);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.TotalBudget).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Advertiser)
                .WithMany(u => u.Campaigns)
                .HasForeignKey(e => e.AdvertiserId);
        });

        // Booking configuration
        modelBuilder.Entity<Booking>(entity => {
            entity.ToTable("bookings");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CampaignId);
            entity.HasIndex(e => e.SpaceId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ProofStatus);
            entity.HasIndex(e => e.PaymentType);
            entity.HasIndex(e => new { e.StartDate, e.EndDate });
            entity.HasIndex(e => new { e.SpaceId, e.StartDate, e.EndDate });
            entity.HasIndex(e => new { e.CampaignId, e.Status });
            entity.HasIndex(e => new { e.Status, e.ProofStatus });
            entity.HasIndex(e => e.ReservedUntil);
            entity.HasIndex(e => e.NextVerificationDue);
            entity.HasIndex(e => e.BalanceDueDate);
            entity.HasIndex(e => e.QualityGuaranteePeriod);
            entity.HasIndex(e => e.PaidAt);
            entity.HasIndex(e => e.PayoutProcessedAt);
            entity.HasIndex(e => e.RefundedAt);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.IsTestData);
            entity.HasIndex(e => new { e.Status, e.IsTestData });

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.PricePerDay).HasPrecision(10, 2);
            entity.Property(e => e.TotalAmount).HasPrecision(10, 2);
            entity.Property(e => e.PlatformFee).HasPrecision(10, 2);
            entity.Property(e => e.StripeFee).HasPrecision(10, 2);
            entity.Property(e => e.TotalWithFees).HasPrecision(10, 2);
            entity.Property(e => e.FirstPayoutAmount).HasPrecision(10, 2);
            entity.Property(e => e.FinalPayoutAmount).HasPrecision(10, 2);
            entity.Property(e => e.BalanceAmount).HasPrecision(10, 2);
            entity.Property(e => e.DepositAmount).HasPrecision(10, 2);
            entity.Property(e => e.RefundAmount).HasPrecision(10, 2);
            entity.Property(e => e.SpaceOwnerAmount).HasPrecision(10, 2);
            entity.Property(e => e.TransferAmount).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Campaign)
                .WithMany(c => c.Bookings)
                .HasForeignKey(e => e.CampaignId);

            entity.HasOne(e => e.Space)
                .WithMany(s => s.Bookings)
                .HasForeignKey(e => e.SpaceId);
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity => {
            entity.ToTable("reviews");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BookingId).IsUnique();
            entity.HasIndex(e => e.SpaceId);
            entity.HasIndex(e => e.Rating);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => new { e.SpaceId, e.Rating });

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Booking)
                .WithOne(b => b.Review)
                .HasForeignKey<Review>(e => e.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Space)
                .WithMany(s => s.Reviews)
                .HasForeignKey(e => e.SpaceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Message configuration
        modelBuilder.Entity<Message>(entity => {
            entity.ToTable("messages");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.CampaignId);
            entity.HasIndex(e => e.SenderId);
            entity.HasIndex(e => e.BookingId);
            entity.HasIndex(e => e.MessageType);
            entity.HasIndex(e => e.ProofStatus);
            entity.HasIndex(e => new { e.CampaignId, e.CreatedAt });
            entity.HasIndex(e => new { e.BookingId, e.MessageType });
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Booking)
                .WithMany(b => b.Messages)
                .HasForeignKey(e => e.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Campaign)
                .WithMany(c => c.Messages)
                .HasForeignKey(e => e.CampaignId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Sender)
                .WithMany(u => u.SentMessages)
                .HasForeignKey(e => e.SenderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Notification configuration
        modelBuilder.Entity<Notification>(entity => {
            entity.ToTable("notifications");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.UserId, e.IsRead });
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.BookingId);
            entity.HasIndex(e => e.CampaignId);
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // PlatformAnalytics configuration
        modelBuilder.Entity<PlatformAnalytics>(entity => {
            entity.ToTable("platform_analytics");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Date).IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.TotalRevenue).HasPrecision(10, 2);
            entity.Property(e => e.PlatformFees).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // StripeWebhookEvent configuration
        modelBuilder.Entity<StripeWebhookEvent>(entity => {
            entity.ToTable("stripe_webhook_events");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.StripeEventId).IsUnique();

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // CronJobLog configuration
        modelBuilder.Entity<CronJobLog>(entity => {
            entity.ToTable("cron_job_logs");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.JobName);
            entity.HasIndex(e => e.ExecutedAt);
            entity.HasIndex(e => e.Status);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.ExecutedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // DemoRequest configuration
        modelBuilder.Entity<DemoRequest>(entity => {
            entity.ToTable("demo_requests");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.Email);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // BugReport configuration
        modelBuilder.Entity<BugReport>(entity => {
            entity.ToTable("bug_reports");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Severity);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.CreatedAt);
            entity.HasIndex(e => e.UserId);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.PageUrl).HasMaxLength(500);
            entity.Property(e => e.LinkedBugId).HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.User)
                .WithMany(u => u.BugReports)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Lead configuration
        modelBuilder.Entity<Lead>(entity => {
            entity.ToTable("leads");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Phase1Qualified);
            entity.HasIndex(e => e.PriorityScore);
            entity.HasIndex(e => new
                { e.HasInventory, e.HasInstallCapability });
            entity.HasIndex(e => e.NextFollowUpDate);
            entity.HasIndex(e => e.Source);
            entity.HasIndex(e => e.ConvertedAt);
            entity.HasIndex(e => e.ConvertedUserId);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.TotalRevenue).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // OutreachLog configuration
        modelBuilder.Entity<OutreachLog>(entity => {
            entity.ToTable("outreach_logs");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.LeadId);
            entity.HasIndex(e => e.SentAt);
            entity.HasIndex(e => e.Channel);
            entity.HasIndex(e => e.Responded);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(e => e.Lead)
                .WithMany(l => l.Outreach)
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ReferralPartner configuration
        modelBuilder.Entity<ReferralPartner>(entity => {
            entity.ToTable("referral_partners");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.PartnerType);

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.TotalRevenue).HasPrecision(10, 2);
            entity.Property(e => e.CommissionRate).HasPrecision(5, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // MarketResearch configuration
        modelBuilder.Entity<MarketResearch>(entity => {
            entity.ToTable("market_research");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.BusinessType);
            entity.HasIndex(e => e.RevisitDate);
            entity.HasIndex(e => new
                { e.HasInventory, e.HasInstallCapability });

            entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}