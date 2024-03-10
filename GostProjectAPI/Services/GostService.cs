using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Data;

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

        public async Task<PagedList<Gost>> GetGostsAsync(GetGostsDto getParams)
        {
            var gosts = _dbContext.Gosts.AsQueryable();

            var filteredOrders = gosts;

            if (getParams?.Filter?.Designation != null)
                filteredOrders = filteredOrders.Where(o => o.Designation.Contains(getParams.Filter.Designation)).AsQueryable();

            if (getParams?.Filter?.Denomination != null)
                filteredOrders = filteredOrders.Where(o => o.Denomination.Contains(getParams.Filter.Denomination)).AsQueryable();

            if (getParams?.Filter?.OKSCode != null)
                filteredOrders = filteredOrders.Where(o => o.OKSCode.Contains(getParams.Filter.OKSCode)).AsQueryable();

            if (getParams?.Filter?.OKPDCode != null)
                filteredOrders = filteredOrders.Where(o => o.OKPDCode.Contains(getParams.Filter.OKPDCode)).AsQueryable();

            if (getParams?.Filter?.DeveloperId != null)
                filteredOrders = filteredOrders.Where(o => o.DeveloperId == getParams.Filter.DeveloperId).AsQueryable();

            // ???
            if (getParams?.Filter?.AcceptanceLevel != null)
                filteredOrders = filteredOrders.Where(o => o.AcceptanceLevel == getParams.Filter.AcceptanceLevel).AsQueryable();

            if (getParams?.Filter?.Text != null)
                filteredOrders = filteredOrders.Where(o => o.Text.Contains(getParams.Filter.Text)).AsQueryable();

            if (getParams?.Filter?.NormativeReferences != null)
                filteredOrders = filteredOrders.Where(o => o.NormativeReferences.Contains(getParams.Filter.NormativeReferences)).AsQueryable();

            if (getParams?.Filter?.Designation != null)
                filteredOrders = filteredOrders.Where(o => o.Designation.Contains(getParams.Filter.Designation)).AsQueryable();

            if (getParams?.Filter?.Designation != null)
                filteredOrders = filteredOrders.Where(o => o.Designation.Contains(getParams.Filter.Designation)).AsQueryable();

            if (getParams?.Filter?.Designation != null)
                filteredOrders = filteredOrders.Where(o => o.Designation.Contains(getParams.Filter.Designation)).AsQueryable();


            var sortedOrders = getParams.SortDirection switch
            {
                "DESC" => filteredOrders.OrderByDescending(o => o.Designation).AsQueryable(),
                _ => filteredOrders.OrderBy(o => o.Designation).AsQueryable()
            };

            return await sortedOrders.ToPagedListAsync(getParams.Pagination);
        }

        public async Task<Gost?> GetGostAsync(uint gostID)
        {
            return await _dbContext.Gosts.FirstOrDefaultAsync(g => g.ID == gostID);
        }

        public async Task<Gost?> AddGostAsync(GostAddDto gostAddDto)
        {
            var gost = _mapper.Map<GostAddDto, Gost>(gostAddDto);

            if (gost == null)
                return null;

            gost.AcceptanceDate = DateTime.Now;
            gost.IntrodutionDate = DateTime.Now;

            await _dbContext.Gosts.AddAsync(gost);
            await _dbContext.SaveChangesAsync();

            List<Keyword> keywords = new();
            List<Keyphrase> keyphrases = new();

            // Преобразование Keywords в сущности Keyword
            foreach (var keywordValue in gostAddDto.Keywords)
            {
                var keyword = new Keyword { Name = keywordValue, GostId = gost.ID };
                keywords.Add(keyword);
            }

            // Преобразование Keyphrases в сущности Keyphrase
            foreach (var keyphraseValue in gostAddDto.Keyphrases)
            {
                var keyphrase = new Keyphrase { Name = keyphraseValue, GostId = gost.ID };
                keyphrases.Add(keyphrase);
            }

            keywords.ForEach(async keyword =>
            {
                await _dbContext.Keywords.AddAsync(keyword);
            });

            keyphrases.ForEach(async keyphrase =>
            {
                await _dbContext.Keyphrases.AddAsync(keyphrase);
            });

            await _dbContext.SaveChangesAsync();

            return gost;
        }


        public async Task<Gost?> EditGostAsync(GostEditDto gostEditDto)
        {
            var oldGost = await GetGostAsync(gostEditDto.ID);

            if (oldGost == null)
                return null;

            foreach (var property in typeof(GostEditDto).GetProperties())
            {
                var value = property.GetValue(gostEditDto);
                if (value != null && value.ToString() != "")
                {
                    var gostProperty = oldGost.GetType().GetProperty(property.Name);
                    gostProperty.SetValue(oldGost, value);
                }
            }

            _dbContext.Gosts.Update(oldGost);
            await _dbContext.SaveChangesAsync();


            List<Keyword> keywords = new();
            List<Keyphrase> keyphrases = new();

            if (gostEditDto.Keywords != null)
            {
                // Преобразование Keywords в сущности Keyword
                foreach (var keywordValue in gostEditDto.Keywords)
                {
                    var keyword = new Keyword { Name = keywordValue, GostId = gostEditDto.ID };
                    keywords.Add(keyword);
                }
            }
            if (gostEditDto.Keyphrases != null)
            {
                // Преобразование Keyphrases в сущности Keyphrase
                foreach (var keyphraseValue in gostEditDto.Keyphrases)
                {
                    var keyphrase = new Keyphrase { Name = keyphraseValue, GostId = gostEditDto.ID };
                    keyphrases.Add(keyphrase);
                }
            }

            keywords.ForEach(async keyword =>
            {
                await _dbContext.Keywords.AddAsync(keyword);
            });
            keyphrases.ForEach(async keyphrase =>
            {
                await _dbContext.Keyphrases.AddAsync(keyphrase);
            });

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
            var favouritesGosts = await _dbContext.FavouritesGosts.Where(g => g.UserId == userID).Select(g => g.GostId).ToListAsync();
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

        public async Task<bool> CheckFavouriteGostsAsync(uint userID, uint gostID)
        {
            var state = await _dbContext.FavouritesGosts.AnyAsync(f => f.UserId == userID && f.GostId == gostID);
            return state;
        }

        public async Task<Gost> AddRequestAsync(uint gostID)
        {
            var newGost = await GetGostAsync(gostID);

            if (newGost != null)
            {
                newGost.RequestsNumber += 1;

                _dbContext.Gosts.Update(newGost);
                await _dbContext.SaveChangesAsync();

                return newGost;
            }

            return null;
        }

        public async Task<Gost> ArchiveGostAsync(uint gostID)
        {
            var oldGost = await GetGostAsync(gostID);

            if (oldGost == null) // || oldGost.OwnerID != user/company ID)
                return null;

            oldGost.IsArchived = true;
            _dbContext.Gosts.Update(oldGost);

            await _dbContext.SaveChangesAsync();

            return oldGost;
        }
    }
}
