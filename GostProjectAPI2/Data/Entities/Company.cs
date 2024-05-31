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

        [Description("Код подключения")]
        public string Code { get; set; }

        [Description("ОГРН/ОГРНИП")]
        public string PSRN { get; set; }

        [Description("Электронная почта")]
        public string Email { get; set; }
	}
}
