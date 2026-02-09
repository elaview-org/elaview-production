using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElaviewBackend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPricingRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "pricing_rules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    SpaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    DaysOfWeek = table.Column<string>(type: "jsonb", nullable: true),
                    Label = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pricing_rules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_pricing_rules_spaces_SpaceId",
                        column: x => x.SpaceId,
                        principalTable: "spaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_pricing_rules_SpaceId",
                table: "pricing_rules",
                column: "SpaceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "pricing_rules");
        }
    }
}
