using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GostProjectAPI.Data.Entities
{
	public class NormativeReference
	{
		[Description("ГОСТ, в который был добавлен")]
		public Gost RootGost { get; set; }
		[ForeignKey(nameof(RootGost))]
		public uint RootGostId { get; set; }

		[Description("ГОСТ, который был добавлен")]
		public Gost ReferenceGost { get; set; }
		[ForeignKey(nameof(ReferenceGost))]
		public uint ReferenceGostId { get; set; }
	}
}
