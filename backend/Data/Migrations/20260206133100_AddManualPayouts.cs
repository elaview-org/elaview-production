using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElaviewBackend.Data.Migrations {
    /// <inheritdoc />
    public partial class AddManualPayouts : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.CreateTable(
                name: "manual_payouts",
                columns: table => new {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SpaceOwnerProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    StripePayoutId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FailureReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table => {
                    table.PrimaryKey("PK_manual_payouts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_manual_payouts_space_owner_profiles_SpaceOwnerProfileId",
                        column: x => x.SpaceOwnerProfileId,
                        principalTable: "space_owner_profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_manual_payouts_SpaceOwnerProfileId",
                table: "manual_payouts",
                column: "SpaceOwnerProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_manual_payouts_Status",
                table: "manual_payouts",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropTable(
                name: "manual_payouts");
        }
    }
}
