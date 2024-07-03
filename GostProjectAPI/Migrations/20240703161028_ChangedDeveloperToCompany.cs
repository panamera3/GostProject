using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangedDeveloperToCompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gosts_Users_DeveloperId",
                table: "Gosts");

            migrationBuilder.AddForeignKey(
                name: "FK_Gosts_Companies_DeveloperId",
                table: "Gosts",
                column: "DeveloperId",
                principalTable: "Companies",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gosts_Companies_DeveloperId",
                table: "Gosts");

            migrationBuilder.AddForeignKey(
                name: "FK_Gosts_Users_DeveloperId",
                table: "Gosts",
                column: "DeveloperId",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
