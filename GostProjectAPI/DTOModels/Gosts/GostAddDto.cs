using GostProjectAPI.Data.Enums.Gost;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Gosts
{
    public class GostAddDto
    {
        public string Designation { get; set; }

        public string Denomination { get; set; }

        public string OKSCode { get; set; }

        public string OKPDCode { get; set; }

        public string Content { get; set; }

        public List<string> Keywords { get; set; }

        public List<string> Keyphrases { get; set; }

        public AcceptanceLevel AcceptanceLevel { get; set; }

        public string Text { get; set; }

        public string NormativeReferences { get; set; }
    }
}
