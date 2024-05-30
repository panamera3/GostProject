namespace GostProjectAPI.DTOModels.Notification
{
	public class NotificationDto
	{
		public uint ID { get; set; }

		public DateTime SendingDate { get; set; }

		public uint CompanyId { get; set; }

		public NotificationUserDto User { get; set; }
	}
}
