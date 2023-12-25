using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    public partial class GostIdReplacedFixed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gosts_Gosts_GostIdReplaced",
                table: "Gosts");

            migrationBuilder.AlterColumn<uint>(
                name: "GostIdReplaced",
                table: "Gosts",
                type: "int unsigned",
                nullable: true,
                oldClrType: typeof(uint),
                oldType: "int unsigned");

            migrationBuilder.AddForeignKey(
                name: "FK_Gosts_Gosts_GostIdReplaced",
                table: "Gosts",
                column: "GostIdReplaced",
                principalTable: "Gosts",
                principalColumn: "ID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gosts_Gosts_GostIdReplaced",
                table: "Gosts");

            migrationBuilder.AlterColumn<uint>(
                name: "GostIdReplaced",
                table: "Gosts",
                type: "int unsigned",
                nullable: false,
                defaultValue: 0u,
                oldClrType: typeof(uint),
                oldType: "int unsigned",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Gosts_Gosts_GostIdReplaced",
                table: "Gosts",
                column: "GostIdReplaced",
                principalTable: "Gosts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
