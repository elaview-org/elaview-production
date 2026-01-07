using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElaviewBackend.Shared.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cron_job_logs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    JobName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ExecutedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: true),
                    ItemsProcessed = table.Column<int>(type: "integer", nullable: true),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true),
                    Metadata = table.Column<JsonDocument>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cron_job_logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "demo_requests",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Company = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CompanySize = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Message = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Priority = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Source = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ContactedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_demo_requests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "leads",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Company = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Source = table.Column<int>(type: "integer", nullable: false),
                    BusinessType = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    HasInventory = table.Column<int>(type: "integer", nullable: false),
                    InventoryType = table.Column<int>(type: "integer", nullable: true),
                    EstimatedSpaces = table.Column<int>(type: "integer", nullable: true),
                    HasInstallCapability = table.Column<int>(type: "integer", nullable: false),
                    Phase1Qualified = table.Column<bool>(type: "boolean", nullable: false),
                    PriorityScore = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    LastContactDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NextAction = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    NextFollowUpDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConvertedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ConvertedUserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SpacesListed = table.Column<int>(type: "integer", nullable: false),
                    FirstBookingDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TotalRevenue = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    ConversionSource = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TestimonialGiven = table.Column<bool>(type: "boolean", nullable: false),
                    WillingToRefer = table.Column<bool>(type: "boolean", nullable: false),
                    ReferralNotes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_leads", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "market_research",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    CompanyName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    BusinessType = table.Column<int>(type: "integer", nullable: false),
                    Website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Location = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    HasInventory = table.Column<int>(type: "integer", nullable: false),
                    HasInstallCapability = table.Column<int>(type: "integer", nullable: false),
                    EstimatedScale = table.Column<int>(type: "integer", nullable: false),
                    ReasonNotPursuing = table.Column<string>(type: "text", nullable: true),
                    RevisitDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    SourceUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_market_research", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "platform_analytics",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    NewUsers = table.Column<int>(type: "integer", nullable: false),
                    NewSpaces = table.Column<int>(type: "integer", nullable: false),
                    NewCampaigns = table.Column<int>(type: "integer", nullable: false),
                    NewBookings = table.Column<int>(type: "integer", nullable: false),
                    TotalRevenue = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    PlatformFees = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_platform_analytics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "referral_partners",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Company = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    PartnerType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    LeadsReferred = table.Column<int>(type: "integer", nullable: false),
                    LeadsConverted = table.Column<int>(type: "integer", nullable: false),
                    TotalRevenue = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CommissionRate = table.Column<decimal>(type: "numeric(5,2)", precision: 5, scale: 2, nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    LastContactDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_referral_partners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "stripe_webhook_events",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    StripeEventId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Processed = table.Column<bool>(type: "boolean", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stripe_webhook_events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Password = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Phone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Avatar = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "outreach_logs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    LeadId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Channel = table.Column<int>(type: "integer", nullable: false),
                    MessageType = table.Column<int>(type: "integer", nullable: false),
                    TemplateUsed = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Subject = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MessageContent = table.Column<string>(type: "text", nullable: true),
                    Responded = table.Column<bool>(type: "boolean", nullable: false),
                    ResponseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResponseSummary = table.Column<string>(type: "text", nullable: true),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    SentBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_outreach_logs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_outreach_logs_leads_LeadId",
                        column: x => x.LeadId,
                        principalTable: "leads",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "advertiser_profiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Industry = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    StripeCustomerId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_advertiser_profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_advertiser_profiles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bug_reports",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    Screenshots = table.Column<List<string>>(type: "text[]", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Severity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    AdminNotes = table.Column<string>(type: "text", nullable: true),
                    LinkedBugId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProcessedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bug_reports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_bug_reports_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "campaigns",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    AdvertiserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ImageUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    TargetAudience = table.Column<string>(type: "text", nullable: true),
                    Goals = table.Column<string>(type: "text", nullable: true),
                    TotalBudget = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_campaigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_campaigns_users_AdvertiserId",
                        column: x => x.AdvertiserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    CampaignId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    BookingId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notifications_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "space_owner_profiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BusinessName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    BusinessType = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    StripeAccountId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    PayoutSchedule = table.Column<int>(type: "integer", nullable: false),
                    OnboardingComplete = table.Column<bool>(type: "boolean", nullable: false),
                    StripeAccountStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastAccountHealthCheck = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AccountDisconnectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AccountDisconnectedNotifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_space_owner_profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_space_owner_profiles_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "spaces",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    OwnerId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    Width = table.Column<double>(type: "double precision", nullable: true),
                    Height = table.Column<double>(type: "double precision", nullable: true),
                    Dimensions = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PricePerDay = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    InstallationFee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    MinDuration = table.Column<int>(type: "integer", nullable: false),
                    MaxDuration = table.Column<int>(type: "integer", nullable: true),
                    Images = table.Column<List<string>>(type: "text[]", nullable: false),
                    AvailableFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AvailableTo = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TotalBookings = table.Column<int>(type: "integer", nullable: false),
                    TotalRevenue = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    AverageRating = table.Column<double>(type: "double precision", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    DimensionsText = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RejectionReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Traffic = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    QuadtreeNodeId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    QuadtreeDepth = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_spaces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_spaces_users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_sessions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    UserId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SessionToken = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastActivityAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RevokedReason = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_sessions_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "bookings",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    CampaignId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SpaceId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalDays = table.Column<int>(type: "integer", nullable: false),
                    PricePerDay = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    PlatformFee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    StripeFee = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    TotalWithFees = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StripePaymentIntentId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProofPhotos = table.Column<List<string>>(type: "text[]", nullable: false),
                    ProofUploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProofApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProofApprovedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    FirstPayoutProcessed = table.Column<bool>(type: "boolean", nullable: false),
                    FirstPayoutDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FirstPayoutAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    FinalPayoutProcessed = table.Column<bool>(type: "boolean", nullable: false),
                    FinalPayoutDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FinalPayoutAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    VerificationSchedule = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    VerificationPhotos = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    NextVerificationDue = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MissedVerifications = table.Column<int>(type: "integer", nullable: false),
                    ReservedUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AdvertiserNotes = table.Column<string>(type: "text", nullable: true),
                    OwnerNotes = table.Column<string>(type: "text", nullable: true),
                    AdminNotes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    BalanceAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    BalanceChargeId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    BalanceDueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    BalancePaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CancellationReason = table.Column<string>(type: "text", nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CancelledBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DepositAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    DepositChargeId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    DepositPaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StripeChargeId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    DepositStripeChargeId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    BalanceStripeChargeId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    PaymentType = table.Column<int>(type: "integer", nullable: false),
                    ProofMessageId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ProofStatus = table.Column<int>(type: "integer", nullable: true),
                    QualityGuaranteePeriod = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RefundAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    RefundProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SpaceOwnerAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    StripeTransferId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    TransferAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    TransferredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DisputeReason = table.Column<string>(type: "text", nullable: true),
                    DisputedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PayoutError = table.Column<string>(type: "text", nullable: true),
                    PayoutProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RefundedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StripeRefundId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    BalanceChargeAttempts = table.Column<int>(type: "integer", nullable: false),
                    BalanceChargeError = table.Column<string>(type: "text", nullable: true),
                    CheckpointTransferIds = table.Column<List<string>>(type: "text[]", nullable: false),
                    FinalTransferId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FinalTransferredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FirstRentalTransferId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    FirstRentalTransferredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    InstallationFeeTransferId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    InstallationFeeTransferredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastBalanceChargeAttempt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastPayoutAttempt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PayoutAttempts = table.Column<int>(type: "integer", nullable: false),
                    PayoutStatus = table.Column<int>(type: "integer", nullable: true),
                    RefundHistory = table.Column<JsonDocument>(type: "jsonb", nullable: true),
                    PendingPayoutReason = table.Column<string>(type: "text", nullable: true),
                    IsTestData = table.Column<bool>(type: "boolean", nullable: false),
                    DisputedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DisputePhotos = table.Column<List<string>>(type: "text[]", nullable: false),
                    DisputeType = table.Column<int>(type: "integer", nullable: true),
                    ResolvedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ResolvedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "text", nullable: true),
                    ResolutionAction = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_bookings_campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bookings_spaces_SpaceId",
                        column: x => x.SpaceId,
                        principalTable: "spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "messages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    CampaignId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SenderId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Content = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    Attachments = table.Column<List<string>>(type: "text[]", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    BookingId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    DisputeReason = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    MessageType = table.Column<int>(type: "integer", nullable: false),
                    ProofApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AutoApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProofApprovedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ProofDisputedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProofStatus = table.Column<int>(type: "integer", nullable: true),
                    AttemptedResolution = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CorrectionDetails = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IssueType = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_messages_bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_messages_campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_messages_users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    BookingId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SpaceId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true),
                    ReviewerType = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_reviews_bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reviews_spaces_SpaceId",
                        column: x => x.SpaceId,
                        principalTable: "spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_advertiser_profiles_StripeCustomerId",
                table: "advertiser_profiles",
                column: "StripeCustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_advertiser_profiles_UserId",
                table: "advertiser_profiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_bookings_BalanceDueDate",
                table: "bookings",
                column: "BalanceDueDate");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_CampaignId",
                table: "bookings",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_CampaignId_Status",
                table: "bookings",
                columns: new[] { "CampaignId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_CreatedAt",
                table: "bookings",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_IsTestData",
                table: "bookings",
                column: "IsTestData");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_NextVerificationDue",
                table: "bookings",
                column: "NextVerificationDue");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_PaidAt",
                table: "bookings",
                column: "PaidAt");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_PaymentType",
                table: "bookings",
                column: "PaymentType");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_PayoutProcessedAt",
                table: "bookings",
                column: "PayoutProcessedAt");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_ProofStatus",
                table: "bookings",
                column: "ProofStatus");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_QualityGuaranteePeriod",
                table: "bookings",
                column: "QualityGuaranteePeriod");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_RefundedAt",
                table: "bookings",
                column: "RefundedAt");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_ReservedUntil",
                table: "bookings",
                column: "ReservedUntil");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_SpaceId",
                table: "bookings",
                column: "SpaceId");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_SpaceId_StartDate_EndDate",
                table: "bookings",
                columns: new[] { "SpaceId", "StartDate", "EndDate" });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_StartDate_EndDate",
                table: "bookings",
                columns: new[] { "StartDate", "EndDate" });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_Status",
                table: "bookings",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_bookings_Status_IsTestData",
                table: "bookings",
                columns: new[] { "Status", "IsTestData" });

            migrationBuilder.CreateIndex(
                name: "IX_bookings_Status_ProofStatus",
                table: "bookings",
                columns: new[] { "Status", "ProofStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_bug_reports_Category",
                table: "bug_reports",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_bug_reports_CreatedAt",
                table: "bug_reports",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_bug_reports_Severity",
                table: "bug_reports",
                column: "Severity");

            migrationBuilder.CreateIndex(
                name: "IX_bug_reports_Status",
                table: "bug_reports",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_bug_reports_UserId",
                table: "bug_reports",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_AdvertiserId",
                table: "campaigns",
                column: "AdvertiserId");

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_AdvertiserId_Status",
                table: "campaigns",
                columns: new[] { "AdvertiserId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_CreatedAt",
                table: "campaigns",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_EndDate",
                table: "campaigns",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_StartDate",
                table: "campaigns",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_Status",
                table: "campaigns",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_cron_job_logs_ExecutedAt",
                table: "cron_job_logs",
                column: "ExecutedAt");

            migrationBuilder.CreateIndex(
                name: "IX_cron_job_logs_JobName",
                table: "cron_job_logs",
                column: "JobName");

            migrationBuilder.CreateIndex(
                name: "IX_cron_job_logs_Status",
                table: "cron_job_logs",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_demo_requests_CreatedAt",
                table: "demo_requests",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_demo_requests_Email",
                table: "demo_requests",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_demo_requests_Status",
                table: "demo_requests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_leads_ConvertedAt",
                table: "leads",
                column: "ConvertedAt");

            migrationBuilder.CreateIndex(
                name: "IX_leads_ConvertedUserId",
                table: "leads",
                column: "ConvertedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_leads_HasInventory_HasInstallCapability",
                table: "leads",
                columns: new[] { "HasInventory", "HasInstallCapability" });

            migrationBuilder.CreateIndex(
                name: "IX_leads_NextFollowUpDate",
                table: "leads",
                column: "NextFollowUpDate");

            migrationBuilder.CreateIndex(
                name: "IX_leads_Phase1Qualified",
                table: "leads",
                column: "Phase1Qualified");

            migrationBuilder.CreateIndex(
                name: "IX_leads_PriorityScore",
                table: "leads",
                column: "PriorityScore");

            migrationBuilder.CreateIndex(
                name: "IX_leads_Source",
                table: "leads",
                column: "Source");

            migrationBuilder.CreateIndex(
                name: "IX_leads_Status",
                table: "leads",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_market_research_BusinessType",
                table: "market_research",
                column: "BusinessType");

            migrationBuilder.CreateIndex(
                name: "IX_market_research_HasInventory_HasInstallCapability",
                table: "market_research",
                columns: new[] { "HasInventory", "HasInstallCapability" });

            migrationBuilder.CreateIndex(
                name: "IX_market_research_RevisitDate",
                table: "market_research",
                column: "RevisitDate");

            migrationBuilder.CreateIndex(
                name: "IX_messages_BookingId",
                table: "messages",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_messages_BookingId_MessageType",
                table: "messages",
                columns: new[] { "BookingId", "MessageType" });

            migrationBuilder.CreateIndex(
                name: "IX_messages_CampaignId",
                table: "messages",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_messages_CampaignId_CreatedAt",
                table: "messages",
                columns: new[] { "CampaignId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_messages_CreatedAt",
                table: "messages",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_messages_MessageType",
                table: "messages",
                column: "MessageType");

            migrationBuilder.CreateIndex(
                name: "IX_messages_ProofStatus",
                table: "messages",
                column: "ProofStatus");

            migrationBuilder.CreateIndex(
                name: "IX_messages_SenderId",
                table: "messages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_BookingId",
                table: "notifications",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_CampaignId",
                table: "notifications",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_CreatedAt",
                table: "notifications",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_Type",
                table: "notifications",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_UserId",
                table: "notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_UserId_IsRead",
                table: "notifications",
                columns: new[] { "UserId", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_outreach_logs_Channel",
                table: "outreach_logs",
                column: "Channel");

            migrationBuilder.CreateIndex(
                name: "IX_outreach_logs_LeadId",
                table: "outreach_logs",
                column: "LeadId");

            migrationBuilder.CreateIndex(
                name: "IX_outreach_logs_Responded",
                table: "outreach_logs",
                column: "Responded");

            migrationBuilder.CreateIndex(
                name: "IX_outreach_logs_SentAt",
                table: "outreach_logs",
                column: "SentAt");

            migrationBuilder.CreateIndex(
                name: "IX_platform_analytics_Date",
                table: "platform_analytics",
                column: "Date",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_referral_partners_PartnerType",
                table: "referral_partners",
                column: "PartnerType");

            migrationBuilder.CreateIndex(
                name: "IX_referral_partners_Status",
                table: "referral_partners",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_BookingId",
                table: "reviews",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_reviews_CreatedAt",
                table: "reviews",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_Rating",
                table: "reviews",
                column: "Rating");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_SpaceId",
                table: "reviews",
                column: "SpaceId");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_SpaceId_Rating",
                table: "reviews",
                columns: new[] { "SpaceId", "Rating" });

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_profiles_AccountDisconnectedAt",
                table: "space_owner_profiles",
                column: "AccountDisconnectedAt");

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_profiles_StripeAccountId",
                table: "space_owner_profiles",
                column: "StripeAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_profiles_StripeAccountStatus",
                table: "space_owner_profiles",
                column: "StripeAccountStatus");

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_profiles_UserId",
                table: "space_owner_profiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_spaces_AverageRating",
                table: "spaces",
                column: "AverageRating");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_City_State",
                table: "spaces",
                columns: new[] { "City", "State" });

            migrationBuilder.CreateIndex(
                name: "IX_spaces_Latitude_Longitude",
                table: "spaces",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_spaces_OwnerId",
                table: "spaces",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_PricePerDay",
                table: "spaces",
                column: "PricePerDay");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_QuadtreeNodeId",
                table: "spaces",
                column: "QuadtreeNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_QuadtreeNodeId_QuadtreeDepth",
                table: "spaces",
                columns: new[] { "QuadtreeNodeId", "QuadtreeDepth" });

            migrationBuilder.CreateIndex(
                name: "IX_spaces_Status",
                table: "spaces",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_Status_CreatedAt",
                table: "spaces",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_spaces_Type",
                table: "spaces",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_Type_Status",
                table: "spaces",
                columns: new[] { "Type", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_stripe_webhook_events_StripeEventId",
                table: "stripe_webhook_events",
                column: "StripeEventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_sessions_ExpiresAt",
                table: "user_sessions",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_user_sessions_IsActive",
                table: "user_sessions",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_user_sessions_SessionToken",
                table: "user_sessions",
                column: "SessionToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_user_sessions_UserId",
                table: "user_sessions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_user_sessions_UserId_IsActive",
                table: "user_sessions",
                columns: new[] { "UserId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_users_CreatedAt",
                table: "users",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Role",
                table: "users",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_users_Status",
                table: "users",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "advertiser_profiles");

            migrationBuilder.DropTable(
                name: "bug_reports");

            migrationBuilder.DropTable(
                name: "cron_job_logs");

            migrationBuilder.DropTable(
                name: "demo_requests");

            migrationBuilder.DropTable(
                name: "market_research");

            migrationBuilder.DropTable(
                name: "messages");

            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "outreach_logs");

            migrationBuilder.DropTable(
                name: "platform_analytics");

            migrationBuilder.DropTable(
                name: "referral_partners");

            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "space_owner_profiles");

            migrationBuilder.DropTable(
                name: "stripe_webhook_events");

            migrationBuilder.DropTable(
                name: "user_sessions");

            migrationBuilder.DropTable(
                name: "leads");

            migrationBuilder.DropTable(
                name: "bookings");

            migrationBuilder.DropTable(
                name: "campaigns");

            migrationBuilder.DropTable(
                name: "spaces");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
