using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElaviewBackend.Data.Migrations {
    /// <inheritdoc />
    public partial class AddReceiptUrlToPayment : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.AddColumn<string>(
                name: "ReceiptUrl",
                table: "payments",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.DropColumn(
                name: "ReceiptUrl",
                table: "payments");
        }
    }
}
