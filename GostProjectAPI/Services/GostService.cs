using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums.Gost;
using GostProjectAPI.DTOModels.Gosts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using static System.Net.Mime.MediaTypeNames;
using System.Reflection.Emit;
using System.Threading.Channels;

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

        public async Task<bool> TryDeleteGostAsync(uint gostID)
        {
            var gost = await GetGostAsync(gostID);

            if (gost == null)
                return false;

            _dbContext.Gosts.Remove(gost);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<Gost>?> GetFavouritesGostsAsync(uint userID)
        {
            var favouritesGosts = await _dbContext.FavouritesGosts.Where(g => g.UserId == userID).Select(g=> g.GostId).ToListAsync();
            var allGosts = await _dbContext.Gosts.Where(g => favouritesGosts.Contains(g.ID)).ToListAsync();
            return allGosts;
        }

        public async Task<FavouriteGost?> AddFavouriteGostAsync(uint gostID, uint userID)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.ID == userID);
            var favouriteGost = new FavouriteGost() { GostId = gostID, UserId = userID };
            _dbContext.FavouritesGosts.Add(favouriteGost);
            await _dbContext.SaveChangesAsync();

            return favouriteGost;
        }

        public async Task<FavouriteGost?> GetFavouriteGostAsync(uint gostID, uint userID)
        {
            return await _dbContext.FavouritesGosts.FirstOrDefaultAsync(g => g.UserId == userID && g.GostId == gostID);
        }

        public async Task<bool> TryDeleteFavouriteGostAsync(uint gostID, uint userID)
        {
            var favouriteGost = await GetFavouriteGostAsync(gostID, userID);

            if (favouriteGost == null)
                return false;

            _dbContext.FavouritesGosts.Remove(favouriteGost);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
