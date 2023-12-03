using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace GostProjectAPI.Data.Entities
{
    public class Company
    {
        [Description("ID")]
        [Key]
        public uint ID { get; set; }

        [Description("Название")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Name { get; set; }

        [Description("ИНН")]
        [Column(TypeName = "VARCHAR(12)")]
        public string Inn { get; set; }
    }
}
