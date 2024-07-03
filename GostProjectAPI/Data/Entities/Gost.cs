using GostProjectAPI.Data.Enums.Gost;
using GostProjectAPI.Migrations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GostProjectAPI.Data.Entities
{
    public class Gost
    {
        [Description("ID")]
        [Key]
        public uint ID { get; set; }

        [Description("Обозначение стандарта")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Designation { get; set; }

        [Description("Наименование стандарта")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Denomination { get; set; }

        [Description("Код ОК(С)")]
        [Column(TypeName = "VARCHAR(128)")]
        public string OKSCode { get; set; }

        [Description("КОД ОКПД")]
        [Column(TypeName = "VARCHAR(128)")]
        public string OKPDCode { get; set; }

        [Description("Год принятия")]
		public ushort AcceptanceYear { get; set; }

		[Description("Год введения")]
        public ushort IntrodutionYear { get; set; }

        [Description("Компания, которая добавила ГОСТ")]
        public Company DeveloperCompany { get; set; }

        [Description("ID компании, которая добавила гост")]
        [ForeignKey(nameof(DeveloperCompany))]
        public uint DeveloperId { get; set; }

		[Description("Наименование разработчика")]
		public string DeveloperName { get; set; }

		[Description("Содержание")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Content { get; set; }

        [Description("Принят взамен")]
        public Gost? GostReplaced { get; set; }

        [Description("ID принят взамен")]
        [ForeignKey(nameof(GostReplaced))]
        public uint? GostIdReplaced { get; set; }

        [Description("Уровень принятия")]
        public AcceptanceLevel AcceptanceLevel { get; set; }

        [Description("Статус(Действующий/отменен/заменен)")]
        public ActionStatus ActionStatus { get; set; }

        [Description("Текст стандарта")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Text { get; set; }

        [Description("Изменения")]
        public string? Changes { get; set; }

        [Description("Поправки")]
        public string? Amendments { get; set; }

        [Description("Количество обращений")]
        public ulong RequestsNumber { get; set; }

        [Description("Заархивироваг ли гост")]
        public bool IsArchived { get; set; }
}
}
