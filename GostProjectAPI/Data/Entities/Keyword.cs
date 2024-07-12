using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
    public class Keyword
    {
        [Description("Название")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Name { get; set; }
        
		public Gost Gost { get; set; }
		[ForeignKey(nameof(Gost))]
        public uint GostId { get; set; }
    }
}
