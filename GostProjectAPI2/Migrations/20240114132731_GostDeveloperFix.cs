﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    public partial class GostDeveloperFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Developer",
                table: "Gosts");

            migrationBuilder.AddColumn<uint>(
                name: "DeveloperId",
                table: "Gosts",
                type: "int unsigned",
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.CreateIndex(
                name: "IX_Gosts_DeveloperId",
                table: "Gosts",
                column: "DeveloperId");

            migrationBuilder.AddForeignKey(
                name: "FK_Gosts_Users_DeveloperId",
                table: "Gosts",
                column: "DeveloperId",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Gosts_Users_DeveloperId",
                table: "Gosts");

            migrationBuilder.DropIndex(
                name: "IX_Gosts_DeveloperId",
                table: "Gosts");

            migrationBuilder.DropColumn(
                name: "DeveloperId",
                table: "Gosts");

            migrationBuilder.AddColumn<string>(
                name: "Developer",
                table: "Gosts",
                type: "VARCHAR(128)",
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
