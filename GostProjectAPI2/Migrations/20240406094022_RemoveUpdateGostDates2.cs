using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    public partial class RemoveUpdateGostDates2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UpdateGostDates");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UpdateGostDates",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GostId = table.Column<uint>(type: "int unsigned", nullable: false),
                    Name = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateDate = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpdateGostDates", x => x.ID);
                    table.ForeignKey(
                        name: "FK_UpdateGostDates_Gosts_GostId",
                        column: x => x.GostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_UpdateGostDates_GostId",
                table: "UpdateGostDates",
                column: "GostId");
        }
    }
}
