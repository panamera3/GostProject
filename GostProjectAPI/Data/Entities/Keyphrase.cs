using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
    public class Keyphrase
    {
        [Description("Название")]
        public string Name { get; set; }

		public Gost Gost { get; set; }
		[ForeignKey(nameof(Gost))]
		public uint GostId { get; set; }
    }
}
