using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
	public class NotificationsLastSeen
	{
		[Description("ID")]
		[Key]
		public uint ID { get; set; }

		[Description("Дата просмотра уведомлений пользователем")]
		public DateTime LastSeenDate { get; set; }

		[Description("Пользователь(администратор), просматривавший уведомления")]
		public uint UserId { get; set; }
		public User User { get; set; }
	}
}
