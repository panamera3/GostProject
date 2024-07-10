using GostProjectAPI.Data.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Users
{
    public class UserAddDto
    {
        [Required]
        public string Login { get; set; }

        [Required]
        public string Password { get; set; }

        public string CompanyCode { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string FirstName { get; set; }

        public string Patronymic { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public string Department { get; set; }

		public bool? IsConfirmed { get; set; } = false;

        public string? PhoneNumber { get; set; }
	}
}
