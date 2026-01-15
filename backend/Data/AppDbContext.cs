using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options) {
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<AdvertiserProfile> AdvertiserProfiles { get; set; } = null!;
    public DbSet<SpaceOwnerProfile> SpaceOwnerProfiles { get; set; } = null!;
    public DbSet<Space> Spaces { get; set; } = null!;
    public DbSet<Campaign> Campaigns { get; set; } = null!;

    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<BookingProof> BookingProofs { get; set; } = null!;
    public DbSet<BookingDispute> BookingDisputes { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;

    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<Payout> Payouts { get; set; } = null!;
    public DbSet<Refund> Refunds { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<StripeWebhookEvent> StripeWebhookEvents { get; set; } = null!;

    public DbSet<Conversation> Conversations { get; set; } = null!;

    public DbSet<ConversationParticipant>
        ConversationParticipants { get; set; } = null!;

    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;

    public DbSet<NotificationPreference> NotificationPreferences { get; set; } =
        null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        new UserConfig().Configure(modelBuilder.Entity<User>());
        new AdvertiserProfileConfig().Configure(modelBuilder
            .Entity<AdvertiserProfile>());
        new SpaceOwnerProfileConfig().Configure(modelBuilder
            .Entity<SpaceOwnerProfile>());
        new SpaceConfig().Configure(modelBuilder.Entity<Space>());
        new CampaignConfig().Configure(modelBuilder.Entity<Campaign>());

        new BookingConfig().Configure(modelBuilder.Entity<Booking>());
        new BookingProofConfig().Configure(modelBuilder.Entity<BookingProof>());
        new BookingDisputeConfig().Configure(
            modelBuilder.Entity<BookingDispute>());
        new ReviewConfig().Configure(modelBuilder.Entity<Review>());

        new PaymentConfig().Configure(modelBuilder.Entity<Payment>());
        new PayoutConfig().Configure(modelBuilder.Entity<Payout>());
        new RefundConfig().Configure(modelBuilder.Entity<Refund>());
        new TransactionConfig().Configure(modelBuilder.Entity<Transaction>());
        new StripeWebhookEventConfig().Configure(modelBuilder
            .Entity<StripeWebhookEvent>());

        new ConversationConfig().Configure(modelBuilder.Entity<Conversation>());
        new ConversationParticipantConfig().Configure(
            modelBuilder.Entity<ConversationParticipant>());
        new MessageConfig().Configure(modelBuilder.Entity<Message>());
        new NotificationConfig().Configure(modelBuilder.Entity<Notification>());
        new NotificationPreferenceConfig().Configure(
            modelBuilder.Entity<NotificationPreference>());
    }
}