﻿// <auto-generated />
using System;
using GostProjectAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GostProjectAPI.Migrations
{
    [DbContext(typeof(GostDBContext))]
    [Migration("20240802230254_AddedRefreshToken")]
    partial class AddedRefreshToken
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.20")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Company", b =>
                {
                    b.Property<uint>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte>("CodeUpdateFrequencyInMonths")
                        .HasColumnType("tinyint unsigned");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PSRN")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdateDateCode")
                        .HasColumnType("datetime(6)");

                    b.HasKey("ID");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.FavouriteGost", b =>
                {
                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.Property<uint>("GostId")
                        .HasColumnType("int unsigned");

                    b.HasKey("UserId", "GostId");

                    b.HasIndex("GostId");

                    b.HasIndex("UserId", "GostId");

                    b.ToTable("FavouritesGosts");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Gost", b =>
                {
                    b.Property<uint>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<byte>("AcceptanceLevel")
                        .HasColumnType("tinyint unsigned");

                    b.Property<ushort>("AcceptanceYear")
                        .HasColumnType("smallint unsigned");

                    b.Property<byte>("ActionStatus")
                        .HasColumnType("tinyint unsigned");

                    b.Property<string>("Amendments")
                        .HasColumnType("longtext");

                    b.Property<string>("Changes")
                        .HasColumnType("longtext");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Denomination")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Designation")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<uint>("DeveloperId")
                        .HasColumnType("int unsigned");

                    b.Property<string>("DeveloperName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<uint?>("GostIdReplaced")
                        .HasColumnType("int unsigned");

                    b.Property<ushort>("IntrodutionYear")
                        .HasColumnType("smallint unsigned");

                    b.Property<bool>("IsArchived")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("OKPDCode")
                        .IsRequired()
                        .HasColumnType("VARCHAR(128)");

                    b.Property<string>("OKSCode")
                        .IsRequired()
                        .HasColumnType("VARCHAR(128)");

                    b.Property<ulong>("RequestsNumber")
                        .HasColumnType("bigint unsigned");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("ID");

                    b.HasIndex("DeveloperId");

                    b.HasIndex("GostIdReplaced");

                    b.ToTable("Gosts");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.GostFile", b =>
                {
                    b.Property<string>("Path")
                        .HasColumnType("VARCHAR(128)");

                    b.Property<uint>("GostId")
                        .HasColumnType("int unsigned");

                    b.HasKey("Path", "GostId");

                    b.HasIndex("GostId");

                    b.HasIndex("Path", "GostId");

                    b.ToTable("GostFiles");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Keyphrase", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.Property<uint>("GostId")
                        .HasColumnType("int unsigned");

                    b.HasKey("Name", "GostId");

                    b.HasIndex("GostId");

                    b.HasIndex("Name", "GostId");

                    b.ToTable("Keyphrases");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Keyword", b =>
                {
                    b.Property<string>("Name")
                        .HasColumnType("VARCHAR(128)");

                    b.Property<uint>("GostId")
                        .HasColumnType("int unsigned");

                    b.HasKey("Name", "GostId");

                    b.HasIndex("GostId");

                    b.HasIndex("Name", "GostId");

                    b.ToTable("Keywords");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.NormativeReference", b =>
                {
                    b.Property<uint>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<string>("ReferenceGostDesignation")
                        .HasColumnType("longtext");

                    b.Property<uint?>("ReferenceGostId")
                        .HasColumnType("int unsigned");

                    b.Property<uint>("RootGostId")
                        .HasColumnType("int unsigned");

                    b.HasKey("ID");

                    b.HasIndex("ReferenceGostId");

                    b.HasIndex("RootGostId");

                    b.ToTable("NormativeReferences");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Notification", b =>
                {
                    b.Property<uint>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<uint>("CompanyId")
                        .HasColumnType("int unsigned");

                    b.Property<DateTime>("SendingDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("UserDepartment")
                        .HasColumnType("longtext");

                    b.Property<string>("UserFullName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.Property<string>("UserLogin")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<byte>("UserRole")
                        .HasColumnType("tinyint unsigned");

                    b.HasKey("ID");

                    b.HasIndex("CompanyId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.NotificationsLastSeen", b =>
                {
                    b.Property<DateTime>("LastSeenDate")
                        .HasColumnType("datetime(6)");

                    b.Property<uint>("UserId")
                        .HasColumnType("int unsigned");

                    b.HasKey("LastSeenDate", "UserId");

                    b.HasIndex("UserId");

                    b.HasIndex("LastSeenDate", "UserId");

                    b.ToTable("NotificationsLastSeen");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.UpdateGostDate", b =>
                {
                    b.Property<uint>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<uint>("GostId")
                        .HasColumnType("int unsigned");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("VARCHAR(128)");

                    b.Property<DateTime>("UpdateDate")
                        .HasColumnType("datetime(6)");

                    b.HasKey("ID");

                    b.HasIndex("GostId");

                    b.ToTable("UpdateGostDates");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.User", b =>
                {
                    b.Property<uint>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int unsigned");

                    b.Property<string>("Department")
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<bool>("IsConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Login")
                        .IsRequired()
                        .HasColumnType("VARCHAR(128)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Patronymic")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("RefreshTokenExpiry")
                        .HasColumnType("datetime(6)");

                    b.Property<byte>("Role")
                        .HasColumnType("tinyint unsigned");

                    b.Property<uint>("WorkCompanyID")
                        .HasColumnType("int unsigned");

                    b.HasKey("ID");

                    b.HasIndex("WorkCompanyID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.FavouriteGost", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "Gost")
                        .WithMany()
                        .HasForeignKey("GostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GostProjectAPI.Data.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gost");

                    b.Navigation("User");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Gost", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Company", "DeveloperCompany")
                        .WithMany()
                        .HasForeignKey("DeveloperId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "GostReplaced")
                        .WithMany()
                        .HasForeignKey("GostIdReplaced");

                    b.Navigation("DeveloperCompany");

                    b.Navigation("GostReplaced");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.GostFile", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "Gost")
                        .WithMany()
                        .HasForeignKey("GostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gost");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Keyphrase", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "Gost")
                        .WithMany()
                        .HasForeignKey("GostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gost");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Keyword", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "Gost")
                        .WithMany()
                        .HasForeignKey("GostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gost");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.NormativeReference", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "ReferenceGost")
                        .WithMany()
                        .HasForeignKey("ReferenceGostId");

                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "RootGost")
                        .WithMany()
                        .HasForeignKey("RootGostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ReferenceGost");

                    b.Navigation("RootGost");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.Notification", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Company", "Company")
                        .WithMany()
                        .HasForeignKey("CompanyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Company");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.NotificationsLastSeen", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.UpdateGostDate", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Gost", "Gost")
                        .WithMany()
                        .HasForeignKey("GostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Gost");
                });

            modelBuilder.Entity("GostProjectAPI.Data.Entities.User", b =>
                {
                    b.HasOne("GostProjectAPI.Data.Entities.Company", "WorkCompany")
                        .WithMany()
                        .HasForeignKey("WorkCompanyID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("WorkCompany");
                });
#pragma warning restore 612, 618
        }
    }
}
