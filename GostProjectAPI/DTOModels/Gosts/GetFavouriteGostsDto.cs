using GostProjectAPI.Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Gosts
{
    public class GetFavouriteGostsDto
	{
		[Required]
		public uint UserId { get; set; }

		[Required]
		public PagingOptions Pagination { get; set; }

	}
}
