using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums.Gost;

namespace GostProjectAPI.DTOModels.Gosts
{
    public class FilterGosts
    {
        public string? Designation { get; set; }

        public string? Denomination { get; set; }

        public string? OKSCode { get; set; }

        public string? OKPDCode { get; set; }

        public DateTime? AcceptanceDate { get; set; }

        public DateTime? IntrodutionDate { get; set; }

        public uint? DeveloperId { get; set; }

        public string? Content { get; set; }

        public List<Keyword>? Keywords { get; set; } = new();

        public List<Keyphrase>? Keyphrases { get; set; } = new();

        public AcceptanceLevel? AcceptanceLevel { get; set; }

        public string? Text { get; set; }

        public string? Amendments { get; set; }
    }
}
