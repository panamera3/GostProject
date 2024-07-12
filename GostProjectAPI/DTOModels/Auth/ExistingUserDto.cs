using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Auth
{
	public class ExistingUserDto
	{
		public uint UserId { get; set; }

		public uint CompanyId { get; set; }
	}
}
