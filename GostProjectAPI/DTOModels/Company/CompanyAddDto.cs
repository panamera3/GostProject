using GostProjectAPI.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Company
{
	public class CompanyAddDto
	{
		[Required]
		public string Name { get; set; }

		[Required]
		public string PSRN { get; set; }

		public string Email { get; set; }

		[Required]
		public string Login { get; set; }

		[Required]
		public string Password { get; set; }

		[Required]
		public string LastName { get; set; }

		[Required]
		public string FirstName { get; set; }

		public string Patronymic { get; set; }

		public UserRole Role { get; set; } = UserRole.Admin;
	}
}
