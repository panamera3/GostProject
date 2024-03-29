﻿using GostProjectAPI.Data.Enums.Gost;
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

        [Description("Дата принятия")]
        public DateTime AcceptanceDate { get; set; }

        [Description("Дата введения")]
        public DateTime IntrodutionDate { get; set; }

        [Description("Разработчик")]
        public User DeveloperUser { get; set; }

        [Description("ID разработчика")]
        [ForeignKey(nameof(DeveloperUser))]
        public uint DeveloperId { get; set; }

        [Description("Содержание")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Content { get; set; }

        [Description("Принят взамен")]
        public Gost? GostReplaced { get; set; }

        [Description("ID принят взамен")]
        [ForeignKey(nameof(GostReplaced))]
        public uint? GostIdReplaced { get; set; }

        /*
        [Description("Ключевые слова")]
        public List<Keyword> Keywords { get; set; } = new();

        [Description("Ключевые фразы")]
        public List<Keyphrase> Keyphrases { get; set; } = new();
        */

        [Description("Уровень принятия")]
        public AcceptanceLevel AcceptanceLevel { get; set; }

        [Description("Статус(Действующий/отменен/заменен)")]
        public ActionStatus ActionStatus { get; set; }

        [Description("Текст стандарта")]
        [Column(TypeName = "VARCHAR(128)")]
        public string Text { get; set; }

        [Description("Нормативные ссылки")]
        public string NormativeReferences { get; set; }

        [Description("Изменения")]
        public string? Changes { get; set; }

        [Description("Поправки")]
        public string? Amendments { get; set; }

        [Description("Количество обращений")]
        public ulong RequestsNumber { get; set; }

        [Description("Заархивирова ли гост")]
        public bool IsArchived { get; set; }
}
}
