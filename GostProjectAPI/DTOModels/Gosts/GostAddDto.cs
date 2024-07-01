using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums.Gost;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Gosts
{
    public class GostAddDto
    {
        public string Designation { get; set; }

        public string Denomination { get; set; }

        public string OKSCode { get; set; }

        public string OKPDCode { get; set; }

        public uint DeveloperId { get; set; }

        public string Content { get; set; }

        public List<string> Keywords { get; set; }

        public List<string> Keyphrases { get; set; }

        public AcceptanceLevel AcceptanceLevel { get; set; }

        public ActionStatus ActionStatus { get; set; }

        public string Text { get; set; }

        public List<uint> NormativeReferences { get; set; }

        public ushort AcceptanceYear { get; set; }

        public ushort IntrodutionYear { get; set; }

        public uint GostIdReplaced { get; set; }
	}
}
