using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
	public class GostFile
	{
		[Description("ID")]
		[Key]
		public uint ID { get; set; }

		[Description("Путь на сервере")]
		[Column(TypeName = "VARCHAR(128)")]
		public string Path { get; set; }

		public uint GostId { get; set; }
		public Gost Gost { get; set; }
	}
}
