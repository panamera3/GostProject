namespace GostProjectAPI.DTOModels
{
    public class PagedList<T> where T : class
    {
        public PagedList(List<T> items, int total, int offset, int pageSize)
        {
            Data = items;
            Pagination = new PagingOptions
            {
                Total = total
            };

            if (offset > 0) Pagination.Offset = offset;
            if (pageSize > 0) Pagination.PageSize = pageSize;
        }

        public PagingOptions Pagination { get; set; }

        public List<T> Data { get; set; }
    }

    public class PagingOptions
    {
        public int Total { get; set; }

        public int PageSize { get; set; } = 10;

        public int Offset { get; set; } = 0;
    }
}
