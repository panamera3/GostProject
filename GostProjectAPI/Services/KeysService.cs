using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Services
{
	public class KeysService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;

		public KeysService(GostDBContext dbContext, IMapper mapper)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}

		public async Task<List<Keyword>?> GetKeyWordsAsync(uint gostID)
		{
			return await _dbContext.Keywords.Where(kw => kw.GostId == gostID).ToListAsync();
		}

		public async Task<List<Keyphrase>?> GetKeyPhrasesAsync(uint gostID)
		{
			return await _dbContext.Keyphrases.Where(kw => kw.GostId == gostID).ToListAsync();
		}
		

		public async Task<List<Keyword>> GetUniqueKeywordsAsync(uint companyID)
		{
			var uniqueKeywords = await _dbContext.Keywords
				.Where(kw => kw.Gost.DeveloperId == companyID)
				.GroupBy(kw => kw.Name)
				.Select(g => g.First())
				.ToListAsync();
			return uniqueKeywords;
		}

		public async Task<List<Keyphrase>> GetUniqueKeyphrasesAsync(uint companyID)
		{
			var uniqueKeyprases = await _dbContext.Keyphrases
				.Where(kp => kp.Gost.DeveloperId == companyID)
				.GroupBy(kp => kp.Name)
				.Select(g => g.First())
				.ToListAsync();
			return uniqueKeyprases;
		}

	}
}
