using System.ComponentModel;

namespace GostProjectAPI.Data.Enums
{
	public enum NotificationStatus
	{
		[Description("Принята")]
		Accepted = 1,

		[Description("На рассмотрении")]
		UnderConsideration,

		[Description("Отклонена")]
		Rejected
	}
}
