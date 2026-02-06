using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElaviewBackend.Data.Migrations {
    /// <inheritdoc />
    public partial class AddSavedPaymentMethods : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.AddColumn<string>(
                name: "StripeCustomerId",
                table: "advertiser_profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "saved_payment_methods",
                columns: table => new {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    AdvertiserProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    StripePaymentMethodId = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Brand = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Last4 = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: false),
                    ExpMonth = table.Column<int>(type: "integer", nullable: false),
                    ExpYear = table.Column<int>(type: "integer", nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table => {
                    table.PrimaryKey("PK_saved_payment_methods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_saved_payment_methods_advertiser_profiles_AdvertiserProfile~",
                        column: x => x.AdvertiserProfileId,
                        principalTable: "advertiser_profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_saved_payment_methods_AdvertiserProfileId",
                table: "saved_payment_methods",
                column: "AdvertiserProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_saved_payment_methods_StripePaymentMethodId",
                table: "saved_payment_methods",
                column: "StripePaymentMethodId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropTable(
                name: "saved_payment_methods");

            migrationBuilder.DropColumn(
                name: "StripeCustomerId",
                table: "advertiser_profiles");
        }
    }
}
