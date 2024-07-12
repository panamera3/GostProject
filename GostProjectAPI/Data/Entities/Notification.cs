using GostProjectAPI.Data.Enums;
using GostProjectAPI.DTOModels.Notification;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GostProjectAPI.Data.Entities
{
	public class Notification
	{
		[Description("ID")]
		[Key]
		public uint ID { get; set; }

		[Description("Дата отправления заявки")]
		public DateTime SendingDate { get; set; }

		[Description("Компания, в которую была отправлена заявка")]
		public Company Company { get; set; }
		[ForeignKey(nameof(Company))]
		public uint CompanyId { get; set; }

		public NotificationStatus Status { get; set; }



		public uint UserId { get; set; }
		public string UserFullName { get; set; }
		public string UserLogin { get; set; }
		public UserRole UserRole { get; set; }
		public string? UserDepartment { get; set; }
	}
}
