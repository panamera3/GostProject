﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using GostProjectAPI.Data.Enums;

namespace GostProjectAPI.Data.Entities
{
    public class User
    {
        [Description("ID")]
        [Key]
        public uint ID { get; set; }

        [Description("Логин")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Login { get; set; }

        [Description("Зашифрованный пароль")] 
        public string PasswordHash { get; set; }

        [Description("Фамилия")]
        public string LastName { get; set; }

        [Description("Имя")]
        public string FirstName { get; set; }

        [Description("Отчество")]
        public string Patronymic { get; set; }

        [Description("Компания")]
        public Company WorkCompany { get; set; }

        [Description("ID компании")]
        [ForeignKey(nameof(WorkCompany))]
        public uint WorkCompanyID { get; set; }

        [Description("Роль пользователя в системе")]
        public UserRole Role { get; set; }
		
		[Description("Подтверждён ли администратором компании")]
        public bool IsConfirmed { get; set; } = false;

		[Description("Подразделение")]
        public string? Department { get; set; }

        [Description("Номер телефона")]
        public string? PhoneNumber { get; set; }

		public string RefreshToken { get; set; }
		public DateTime RefreshTokenExpiry { get; set; }
	}
}
