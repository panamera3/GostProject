using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
	public class UpdateGostDate
	{
		[Description("ID")]
		[Key]
		public uint ID { get; set; }

		[Description("Дата последней актуализации")]
		public DateTime UpdateDate { get; set; }

		[Description("Название обновлённого поля")]
		[Column(TypeName = "VARCHAR(128)")]
		public string Name { get; set; }

		public uint GostId { get; set; }
		public Gost Gost { get; set; }
	}
}
