using GostProjectAPI.DTOModels;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Extensions
{
    public static class IQueryableExtensions
    {
        public static async Task<PagedList<T>> ToPagedListAsync<T>(this IQueryable<T> source, PagingOptions pagingOptions) where T : class
        {
            var total = await source.CountAsync();

            if (pagingOptions.Offset > 0) source = source.Skip(pagingOptions.Offset);
            if (pagingOptions.PageSize > 0) source = source.Take(pagingOptions.PageSize);

            var items = await source.ToListAsync();

            return new PagedList<T>(items, total, pagingOptions.Offset, pagingOptions.PageSize);
        }
    }
}
