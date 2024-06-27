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
	}
}
