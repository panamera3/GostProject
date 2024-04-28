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

		public uint UserId { get; set; }
		public User User{ get; set; }
	}
}
