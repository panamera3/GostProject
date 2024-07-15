using GostProjectAPI.Data.Enums;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Gosts
{
    public class GetGostsDto
    {
        [Required]
        public uint CompanyID { get; set; }

        [Required]
        public PagingOptions Pagination { get; set; }

        [EnumDataType(typeof(SortDirection))]
        public string? SortDirection { get; set; }

		public string? SortField { get; set; }

		public FilterGosts? Filter { get; set; }

        public string? SearchInFilePrompt { get; set; }

        public bool Archived { get; set; } = false;
    }
}
