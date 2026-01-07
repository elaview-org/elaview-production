using System;
using System.Collections.Generic;
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
                name: "advertiser_profiles",
                columns: table => new
                {
                    ProfileId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Industry = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Website = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    OnboardingComplete = table.Column<bool>(type: "boolean", nullable: false),
                    StripeAccountId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    StripeAccountStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    StripeLastAccountHealthCheck = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StripeAccountDisconnectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StripeAccountDisconnectedNotifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_advertiser_profiles", x => x.ProfileId);
                });

            migrationBuilder.CreateTable(
                name: "campaigns",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    AdvertiserProfileId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ImageUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    TargetAudience = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Goals = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
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
                        name: "FK_campaigns_advertiser_profiles_AdvertiserProfileId",
                        column: x => x.AdvertiserProfileId,
                        principalTable: "advertiser_profiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "profiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    ProfileType = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<string>(type: "character varying(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "space_owner_profiles",
                columns: table => new
                {
                    ProfileId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BusinessName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    BusinessType = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    PayoutSchedule = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    OnboardingComplete = table.Column<bool>(type: "boolean", nullable: false),
                    StripeAccountId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    StripeAccountStatus = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    StripeLastAccountHealthCheck = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StripeAccountDisconnectedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    StripeAccountDisconnectedNotifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_space_owner_profiles", x => x.ProfileId);
                    table.ForeignKey(
                        name: "FK_space_owner_profiles_profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
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
                    ActiveProfileId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_users_profiles_ActiveProfileId",
                        column: x => x.ActiveProfileId,
                        principalTable: "profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "spaces",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValueSql: "gen_random_uuid()"),
                    OwnerProfileId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
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
                    DimensionsText = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
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
                    RejectionReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Traffic = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_spaces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_spaces_space_owner_profiles_OwnerProfileId",
                        column: x => x.OwnerProfileId,
                        principalTable: "space_owner_profiles",
                        principalColumn: "ProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_advertiser_profiles_StripeAccountId",
                table: "advertiser_profiles",
                column: "StripeAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_advertiser_profiles_StripeAccountStatus",
                table: "advertiser_profiles",
                column: "StripeAccountStatus");

            migrationBuilder.CreateIndex(
                name: "IX_campaigns_AdvertiserProfileId",
                table: "campaigns",
                column: "AdvertiserProfileId");

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
                name: "IX_profiles_ProfileType",
                table: "profiles",
                column: "ProfileType");

            migrationBuilder.CreateIndex(
                name: "IX_profiles_UserId",
                table: "profiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_profiles_StripeAccountId",
                table: "space_owner_profiles",
                column: "StripeAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_space_owner_profiles_StripeAccountStatus",
                table: "space_owner_profiles",
                column: "StripeAccountStatus");

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
                name: "IX_spaces_OwnerProfileId",
                table: "spaces",
                column: "OwnerProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_spaces_PricePerDay",
                table: "spaces",
                column: "PricePerDay");

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
                name: "IX_users_ActiveProfileId",
                table: "users",
                column: "ActiveProfileId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_advertiser_profiles_profiles_ProfileId",
                table: "advertiser_profiles",
                column: "ProfileId",
                principalTable: "profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_profiles_users_UserId",
                table: "profiles",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_users_profiles_ActiveProfileId",
                table: "users");

            migrationBuilder.DropTable(
                name: "campaigns");

            migrationBuilder.DropTable(
                name: "spaces");

            migrationBuilder.DropTable(
                name: "advertiser_profiles");

            migrationBuilder.DropTable(
                name: "space_owner_profiles");

            migrationBuilder.DropTable(
                name: "profiles");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
