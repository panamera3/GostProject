using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.Data.Entities
{
	public class NormativeReferences
	{
		[Description("ID")]
		[Key]
		public uint ID { get; set; }

		[Description("ГОСТ, в который был добавлен")]
		public uint RootGostId { get; set; }
		public Gost RootGost { get; set; }


		[Description("ГОСТ, который был добавлен")]
		public uint ReferenceGostId { get; set; }
		public Gost ReferenceGost { get; set; }
	}
}
