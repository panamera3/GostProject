using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace GostProjectAPI.Services
{
	public class KeysService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly CurrentUserService _currentUserService;

		public KeysService(GostDBContext dbContext, IMapper mapper, CurrentUserService currentUserService)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_currentUserService = currentUserService;
		}

		public async Task<List<Keyword>?> GetKeyWordsAsync(uint gostID)
		{
			return await _dbContext.Keywords.Where(kw => kw.GostId == gostID).ToListAsync();
		}

		public async Task<List<Keyphrase>?> GetKeyPhrasesAsync(uint gostID)
		{
			return await _dbContext.Keyphrases.Where(kw => kw.GostId == gostID).ToListAsync();
		}
		

		public async Task<List<Keyword>> GetUniqueKeywordsAsync()
		{
			var companyId = _currentUserService.CompanyId;
			var uniqueKeywords = await _dbContext.Keywords
				.Where(kw => kw.Gost.DeveloperId == companyId)
				.GroupBy(kw => kw.Name)
				.Select(g => g.First())
				.ToListAsync();
			return uniqueKeywords;
		}

		public async Task<List<Keyphrase>> GetUniqueKeyphrasesAsync()
		{
			var companyId = _currentUserService.CompanyId;
			var uniqueKeyprases = await _dbContext.Keyphrases
				.Where(kp => kp.Gost.DeveloperId == companyId)
				.GroupBy(kp => kp.Name)
				.Select(g => g.First())
				.ToListAsync();
			return uniqueKeyprases;
		}
	}
}
