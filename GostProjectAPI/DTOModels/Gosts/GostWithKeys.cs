using GostProjectAPI.Data.Entities;

namespace GostProjectAPI.DTOModels.Gosts
{
	public class GostWithKeys
	{
		public Gost Gost { get; set; }

		public List<Keyword> Keywords { get; set; }

		public List<Keyphrase> Keyphrases { get; set; }
	}
}
