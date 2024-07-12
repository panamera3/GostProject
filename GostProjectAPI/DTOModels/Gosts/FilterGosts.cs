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

		public string? Text { get; set; }

		public ushort? AcceptanceYear { get; set; }

        public ushort? IntrodutionYear { get; set; }

        public string? Content { get; set; }

        public List<string>? Keywords { get; set; } = new();

        public List<string>? Keyphrases { get; set; } = new();

        public AcceptanceLevel? AcceptanceLevel { get; set; }

        public ActionStatus? ActionStatus { get; set; }

		public uint? GostIdReplaced { get; set; }

		public string? DeveloperName { get; set; }
	}
}
