using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GostProjectAPI.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Code = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PSRN = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UpdateDateCode = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CodeUpdateFrequencyInMonths = table.Column<byte>(type: "tinyint unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.ID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Gosts",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Designation = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Denomination = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OKSCode = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OKPDCode = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AcceptanceYear = table.Column<ushort>(type: "smallint unsigned", nullable: false),
                    IntrodutionYear = table.Column<ushort>(type: "smallint unsigned", nullable: false),
                    DeveloperId = table.Column<uint>(type: "int unsigned", nullable: false),
                    DeveloperName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GostIdReplaced = table.Column<uint>(type: "int unsigned", nullable: true),
                    AcceptanceLevel = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    ActionStatus = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    Text = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Changes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Amendments = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequestsNumber = table.Column<ulong>(type: "bigint unsigned", nullable: false),
                    IsArchived = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gosts", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Gosts_Companies_DeveloperId",
                        column: x => x.DeveloperId,
                        principalTable: "Companies",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Gosts_Gosts_GostIdReplaced",
                        column: x => x.GostIdReplaced,
                        principalTable: "Gosts",
                        principalColumn: "ID");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SendingDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CompanyId = table.Column<uint>(type: "int unsigned", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<uint>(type: "int unsigned", nullable: false),
                    UserFullName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserLogin = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserRole = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    UserDepartment = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Notifications_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Login = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Patronymic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    WorkCompanyID = table.Column<uint>(type: "int unsigned", nullable: false),
                    Role = table.Column<byte>(type: "tinyint unsigned", nullable: false),
                    IsConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Department = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Users_Companies_WorkCompanyID",
                        column: x => x.WorkCompanyID,
                        principalTable: "Companies",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "GostFiles",
                columns: table => new
                {
                    Path = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GostFiles", x => new { x.Path, x.GostId });
                    table.ForeignKey(
                        name: "FK_GostFiles_Gosts_GostId",
                        column: x => x.GostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Keyphrases",
                columns: table => new
                {
                    Name = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Keyphrases", x => new { x.Name, x.GostId });
                    table.ForeignKey(
                        name: "FK_Keyphrases_Gosts_GostId",
                        column: x => x.GostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Keywords",
                columns: table => new
                {
                    Name = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Keywords", x => new { x.Name, x.GostId });
                    table.ForeignKey(
                        name: "FK_Keywords_Gosts_GostId",
                        column: x => x.GostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "NormativeReferences",
                columns: table => new
                {
                    RootGostId = table.Column<uint>(type: "int unsigned", nullable: false),
                    ReferenceGostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NormativeReferences", x => new { x.RootGostId, x.ReferenceGostId });
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

            migrationBuilder.CreateTable(
                name: "UpdateGostDates",
                columns: table => new
                {
                    ID = table.Column<uint>(type: "int unsigned", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UpdateDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Name = table.Column<string>(type: "VARCHAR(128)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GostId = table.Column<uint>(type: "int unsigned", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "FavouritesGosts",
                columns: table => new
                {
                    UserId = table.Column<uint>(type: "int unsigned", nullable: false),
                    GostId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavouritesGosts", x => new { x.UserId, x.GostId });
                    table.ForeignKey(
                        name: "FK_FavouritesGosts_Gosts_GostId",
                        column: x => x.GostId,
                        principalTable: "Gosts",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FavouritesGosts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "NotificationsLastSeen",
                columns: table => new
                {
                    LastSeenDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UserId = table.Column<uint>(type: "int unsigned", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationsLastSeen", x => new { x.LastSeenDate, x.UserId });
                    table.ForeignKey(
                        name: "FK_NotificationsLastSeen_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_FavouritesGosts_GostId",
                table: "FavouritesGosts",
                column: "GostId");

            migrationBuilder.CreateIndex(
                name: "IX_FavouritesGosts_UserId_GostId",
                table: "FavouritesGosts",
                columns: new[] { "UserId", "GostId" });

            migrationBuilder.CreateIndex(
                name: "IX_GostFiles_GostId",
                table: "GostFiles",
                column: "GostId");

            migrationBuilder.CreateIndex(
                name: "IX_GostFiles_Path_GostId",
                table: "GostFiles",
                columns: new[] { "Path", "GostId" });

            migrationBuilder.CreateIndex(
                name: "IX_Gosts_DeveloperId",
                table: "Gosts",
                column: "DeveloperId");

            migrationBuilder.CreateIndex(
                name: "IX_Gosts_GostIdReplaced",
                table: "Gosts",
                column: "GostIdReplaced");

            migrationBuilder.CreateIndex(
                name: "IX_Keyphrases_GostId",
                table: "Keyphrases",
                column: "GostId");

            migrationBuilder.CreateIndex(
                name: "IX_Keyphrases_Name_GostId",
                table: "Keyphrases",
                columns: new[] { "Name", "GostId" });

            migrationBuilder.CreateIndex(
                name: "IX_Keywords_GostId",
                table: "Keywords",
                column: "GostId");

            migrationBuilder.CreateIndex(
                name: "IX_Keywords_Name_GostId",
                table: "Keywords",
                columns: new[] { "Name", "GostId" });

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferences_ReferenceGostId",
                table: "NormativeReferences",
                column: "ReferenceGostId");

            migrationBuilder.CreateIndex(
                name: "IX_NormativeReferences_RootGostId_ReferenceGostId",
                table: "NormativeReferences",
                columns: new[] { "RootGostId", "ReferenceGostId" });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_CompanyId",
                table: "Notifications",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationsLastSeen_LastSeenDate_UserId",
                table: "NotificationsLastSeen",
                columns: new[] { "LastSeenDate", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationsLastSeen_UserId",
                table: "NotificationsLastSeen",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UpdateGostDates_GostId",
                table: "UpdateGostDates",
                column: "GostId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_WorkCompanyID",
                table: "Users",
                column: "WorkCompanyID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavouritesGosts");

            migrationBuilder.DropTable(
                name: "GostFiles");

            migrationBuilder.DropTable(
                name: "Keyphrases");

            migrationBuilder.DropTable(
                name: "Keywords");

            migrationBuilder.DropTable(
                name: "NormativeReferences");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "NotificationsLastSeen");

            migrationBuilder.DropTable(
                name: "UpdateGostDates");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Gosts");

            migrationBuilder.DropTable(
                name: "Companies");
        }
    }
}
