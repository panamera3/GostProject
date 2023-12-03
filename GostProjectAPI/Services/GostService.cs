using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Gosts;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Services
{
    public class GostService
    {
        private readonly IMapper _mapper;
        private readonly GostDBContext _dbContext;


        public GostService(GostDBContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<Gost>?> GetGostsAsync()
        {
            return await _dbContext.Gosts.ToListAsync();
        }

        public async Task<Gost?> GetGostAsync(uint gostID)
        {
            return await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
        }

        public async Task<Gost?> AddGostAsync(GostAddDto gostAddDto)
        {
            // добавить маппер
            var gost = _mapper.Map<GostAddDto, Gost>(gostAddDto);

            if (gost == null)
                return null;

            await _dbContext.Gosts.AddAsync(gost);
            await _dbContext.SaveChangesAsync();

            return gost;
        }

        public async Task<Gost?> EditGostAsync(GostEditDto gostEditDto)
        {
            var oldGost = await GetGostAsync(gostEditDto.ID);

            if (gostEditDto == null) // || oldGost.OwnerID != user/company ID)
                return null;

            _mapper.Map(gostEditDto, oldGost);
            _dbContext.Gosts.Update(oldGost);

            await _dbContext.SaveChangesAsync();

            return oldGost;
        }
    }
}
