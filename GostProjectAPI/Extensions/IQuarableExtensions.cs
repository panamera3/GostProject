using GostProjectAPI.DTOModels;

namespace GostProjectAPI.Extensions
{
    public static class IQueryableExtensions
    {
        public static async Task<PagedList<T>> ToPagedListAsync<T>(this IQueryable<T> source, PagingOptions pagingOptions) where T : class
        {
            var total = source.Count();

            var data = source.ToList();

            if (pagingOptions.Offset > 0) data = data.Skip(pagingOptions.Offset).ToList();
            if (pagingOptions.PageSize > 0) data = data.Take(pagingOptions.PageSize).ToList();

            return new PagedList<T>(data, total, pagingOptions.Offset, pagingOptions.PageSize);
        }
    }
}
