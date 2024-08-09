using GostProjectAPI.Data.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;

namespace GostProjectAPI.DTOModels.Users
{
	public class UserResponseDto
	{
		public uint ID { get; set; }

		public string Login { get; set; }

		public string LastName { get; set; }

		public string FirstName { get; set; }

		public string Patronymic { get; set; }

		public UserRole Role { get; set; }

		public bool IsConfirmed { get; set; } = false;

		public string? Department { get; set; }

		public string? PhoneNumber { get; set; }
	}
}
