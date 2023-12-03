using GostProjectAPI.Data.Enums.Gost;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Gosts
{
    public class GostAddDto
    {
        [Required]
        public string Designation { get; set; }

        [Required] 
        public string Denomination { get; set; }

        [Required] 
        public string OKSCode { get; set; }

        [Required] 
        public string OKPDCode { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public List<string> Keywords { get; set; }

        [Required]
        public List<string> Keyphrases { get; set; }

        [Required]
        public AcceptanceLevel AcceptanceLevel { get; set; }
    }
}
