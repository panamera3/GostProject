using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace GostProjectAPI.Data.Entities
{
    public class Company
    {
        [Description("ID")]
        [Key]
        public uint ID { get; set; }

        [Description("Название")]
        public string Name { get; set; }

        [Description("Код подключения")]
        public string Code { get; set; }

        [Description("ОГРН/ОГРНИП")]
        public string PSRN { get; set; }

        [Description("Электронная почта")]
        public string Email { get; set; }

        [Description("Дата обновления кода подключения")]
        public DateTime UpdateDateCode { get; set; } = DateTime.Now.AddMonths(6);

		[Description("Частота обновления кода подключения, в месяцах, по умолчанию-6 месяцев")]
        public byte CodeUpdateFrequencyInMonths { get; set; } = 6;
	}
}
