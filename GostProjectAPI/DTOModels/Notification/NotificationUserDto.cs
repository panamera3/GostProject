using GostProjectAPI.Data.Enums;

namespace GostProjectAPI.DTOModels.Notification
{
	public class NotificationUserDto
	{
		public uint ID { get; set; }

		public string FullName { get; set; }

		public string Login { get; set; }

		public string Department { get; set; }

		public UserRole Role { get; set; }

	}
}
