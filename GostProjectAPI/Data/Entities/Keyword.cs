using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
    public class Keyword
    {
        [Description("ID")]
        [Key]
        public uint ID { get; set; }

        [Description("Название")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Name { get; set; }

        public uint GostId { get; set; }
        public Gost Gost { get; set; }

    }
}
