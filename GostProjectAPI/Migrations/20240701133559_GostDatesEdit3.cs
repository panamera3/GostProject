using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    /// <inheritdoc />
    public partial class GostDatesEdit3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptanceDate",
                table: "Gosts");

            migrationBuilder.DropColumn(
                name: "IntrodutionDate",
                table: "Gosts");

            migrationBuilder.AddColumn<ushort>(
                name: "AcceptanceYear",
                table: "Gosts",
                type: "smallint unsigned",
                nullable: false,
                defaultValue: (ushort)0);

            migrationBuilder.AddColumn<ushort>(
                name: "IntrodutionYear",
                table: "Gosts",
                type: "smallint unsigned",
                nullable: false,
                defaultValue: (ushort)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptanceYear",
                table: "Gosts");

            migrationBuilder.DropColumn(
                name: "IntrodutionYear",
                table: "Gosts");

            migrationBuilder.AddColumn<DateOnly>(
                name: "AcceptanceDate",
                table: "Gosts",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<DateOnly>(
                name: "IntrodutionDate",
                table: "Gosts",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }
    }
}
