using GostProjectAPI.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Users
{
	public class UserEditDto
	{
		[Required]
		public uint ID { get; set; }

		public string? FullName { get; set; }

		public string? Login { get; set; }

		public string? Department { get; set; }

		public UserRole? Role { get; set; }
	}
}
