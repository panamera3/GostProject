using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Services
{
    public class GostService
    {
        private readonly GostDBContext _dbContext;

        public GostService(GostDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Gost>?> GetGostsAsync()
        {
            return await _dbContext.Gosts.ToListAsync();
        }

        public async Task<Gost?> GetGostAsync(int gostID)
        {
            return await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
        }
    }
}
