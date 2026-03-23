using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElaviewBackend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDigitalSignageSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "careers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Department = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Requirements = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_careers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "digital_signage_screens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SpaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    SpaceOwnerProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Resolution = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LastHeartbeatAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_digital_signage_screens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_digital_signage_screens_space_owner_profiles_SpaceOwnerProf~",
                        column: x => x.SpaceOwnerProfileId,
                        principalTable: "space_owner_profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_digital_signage_screens_spaces_SpaceId",
                        column: x => x.SpaceId,
                        principalTable: "spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "digital_signage_devices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    ScreenId = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceToken = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DeviceName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PairingCode = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: true),
                    PairingCodeExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastSeenAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_digital_signage_devices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_digital_signage_devices_digital_signage_screens_ScreenId",
                        column: x => x.ScreenId,
                        principalTable: "digital_signage_screens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "digital_signage_schedules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    ScreenId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    CampaignId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreativeAssetUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CreativeType = table.Column<int>(type: "integer", nullable: false),
                    RotationIntervalSeconds = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    PushedToDevicesAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_digital_signage_schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_digital_signage_schedules_bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_digital_signage_schedules_campaigns_CampaignId",
                        column: x => x.CampaignId,
                        principalTable: "campaigns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_digital_signage_schedules_digital_signage_screens_ScreenId",
                        column: x => x.ScreenId,
                        principalTable: "digital_signage_screens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "digital_signage_proof_events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    ScreenId = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduleId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingId = table.Column<Guid>(type: "uuid", nullable: false),
                    DisplayedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DisplayedDurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    Metadata = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_digital_signage_proof_events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_digital_signage_proof_events_bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_digital_signage_proof_events_digital_signage_devices_Device~",
                        column: x => x.DeviceId,
                        principalTable: "digital_signage_devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_digital_signage_proof_events_digital_signage_schedules_Sche~",
                        column: x => x.ScheduleId,
                        principalTable: "digital_signage_schedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_digital_signage_proof_events_digital_signage_screens_Screen~",
                        column: x => x.ScreenId,
                        principalTable: "digital_signage_screens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_careers_Department",
                table: "careers",
                column: "Department");

            migrationBuilder.CreateIndex(
                name: "IX_careers_IsActive",
                table: "careers",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_devices_DeviceToken",
                table: "digital_signage_devices",
                column: "DeviceToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_devices_PairingCode",
                table: "digital_signage_devices",
                column: "PairingCode");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_devices_ScreenId",
                table: "digital_signage_devices",
                column: "ScreenId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_devices_Status",
                table: "digital_signage_devices",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_proof_events_BookingId",
                table: "digital_signage_proof_events",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_proof_events_DeviceId",
                table: "digital_signage_proof_events",
                column: "DeviceId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_proof_events_DisplayedAt",
                table: "digital_signage_proof_events",
                column: "DisplayedAt");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_proof_events_ScheduleId",
                table: "digital_signage_proof_events",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_proof_events_ScreenId",
                table: "digital_signage_proof_events",
                column: "ScreenId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_schedules_BookingId",
                table: "digital_signage_schedules",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_schedules_CampaignId",
                table: "digital_signage_schedules",
                column: "CampaignId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_schedules_ScreenId",
                table: "digital_signage_schedules",
                column: "ScreenId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_schedules_StartDate_EndDate",
                table: "digital_signage_schedules",
                columns: new[] { "StartDate", "EndDate" });

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_schedules_Status",
                table: "digital_signage_schedules",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_screens_SpaceId",
                table: "digital_signage_screens",
                column: "SpaceId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_screens_SpaceOwnerProfileId",
                table: "digital_signage_screens",
                column: "SpaceOwnerProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_digital_signage_screens_Status",
                table: "digital_signage_screens",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "careers");

            migrationBuilder.DropTable(
                name: "digital_signage_proof_events");

            migrationBuilder.DropTable(
                name: "digital_signage_devices");

            migrationBuilder.DropTable(
                name: "digital_signage_schedules");

            migrationBuilder.DropTable(
                name: "digital_signage_screens");
        }
    }
}
