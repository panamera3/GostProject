using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    /// <inheritdoc />
    public partial class NormativeReferencesChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NormativeReferencess");

            migrationBuilder.DropColumn(
                name: "NormativeReferences",
                table: "Gosts");

            migrationBuilder.CreateTable(
                name: "NormativeReferences",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RootGostId = table.Column<uint>(type: "int unsigned", nullable: false),
                    ReferenceGostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NormativeReferences", x => x.ID);
                    table.ForeignKey(
                        name: "FK_NormativeReferences_Gosts_ReferenceGostId",
                        column: x => x.ReferenceGostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NormativeReferences_Gosts_RootGostId",
                        column: x => x.RootGostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferences_ReferenceGostId",
                table: "NormativeReferences",
                column: "ReferenceGostId");

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferences_RootGostId",
                table: "NormativeReferences",
                column: "RootGostId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NormativeReferences");

            migrationBuilder.AddColumn<string>(
                name: "NormativeReferences",
                table: "Gosts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "NormativeReferencess",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ReferenceGostId = table.Column<uint>(type: "int unsigned", nullable: false),
                    RootGostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NormativeReferencess", x => x.ID);
                    table.ForeignKey(
                        name: "FK_NormativeReferencess_Gosts_ReferenceGostId",
                        column: x => x.ReferenceGostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NormativeReferencess_Gosts_RootGostId",
                        column: x => x.RootGostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferencess_ReferenceGostId",
                table: "NormativeReferencess",
                column: "ReferenceGostId");

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferencess_RootGostId",
                table: "NormativeReferencess",
                column: "RootGostId");
        }
    }
}
