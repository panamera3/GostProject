using GostProjectAPI.Data.Entities;

namespace GostProjectAPI.DTOModels.Gosts
{
	public class GostWithKeysAndReferences
	{
		public Gost Gost { get; set; }

		public List<Keyword> Keywords { get; set; }

		public List<Keyphrase> Keyphrases { get; set; }

		public List<NormativeReference> NormativeReferences { get; set; }
	}
}
