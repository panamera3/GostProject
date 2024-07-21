using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddEditNormativeReferencesChanged : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NormativeReferences_Gosts_ReferenceGostId",
                table: "NormativeReferences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NormativeReferences",
                table: "NormativeReferences");

            migrationBuilder.DropIndex(
                name: "IX_NormativeReferences_RootGostId_ReferenceGostId",
                table: "NormativeReferences");

            migrationBuilder.AlterColumn<uint>(
                name: "ReferenceGostId",
                table: "NormativeReferences",
                type: "int unsigned",
                nullable: true,
                oldClrType: typeof(uint),
                oldType: "int unsigned");

            migrationBuilder.AddColumn<uint>(
                name: "ID",
                table: "NormativeReferences",
                type: "int unsigned",
                nullable: false,
                defaultValue: 0u)
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceGostDesignation",
                table: "NormativeReferences",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_NormativeReferences",
                table: "NormativeReferences",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferences_RootGostId",
                table: "NormativeReferences",
                column: "RootGostId");

            migrationBuilder.AddForeignKey(
                name: "FK_NormativeReferences_Gosts_ReferenceGostId",
                table: "NormativeReferences",
                column: "ReferenceGostId",
                principalTable: "Gosts",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NormativeReferences_Gosts_ReferenceGostId",
                table: "NormativeReferences");

            migrationBuilder.DropPrimaryKey(
                name: "PK_NormativeReferences",
                table: "NormativeReferences");

            migrationBuilder.DropIndex(
                name: "IX_NormativeReferences_RootGostId",
                table: "NormativeReferences");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "NormativeReferences");

            migrationBuilder.DropColumn(
                name: "ReferenceGostDesignation",
                table: "NormativeReferences");

            migrationBuilder.AlterColumn<uint>(
                name: "ReferenceGostId",
                table: "NormativeReferences",
                type: "int unsigned",
                nullable: false,
                defaultValue: 0u,
                oldClrType: typeof(uint),
                oldType: "int unsigned",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_NormativeReferences",
                table: "NormativeReferences",
                columns: new[] { "RootGostId", "ReferenceGostId" });

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferences_RootGostId_ReferenceGostId",
                table: "NormativeReferences",
                columns: new[] { "RootGostId", "ReferenceGostId" });

            migrationBuilder.AddForeignKey(
                name: "FK_NormativeReferences_Gosts_ReferenceGostId",
                table: "NormativeReferences",
                column: "ReferenceGostId",
                principalTable: "Gosts",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
