using Amazon.S3;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Controllers
{
	// [Authorize]
	[ApiController]
	[Route("/api/[controller]/[action]")]
	public class GostController : CommonControllerBase
	{
		private readonly GostService _gostService;
		private readonly IAmazonS3 _s3Client;

		public GostController(GostService gostService, IAmazonS3 s3Client)
		{
			_gostService = gostService;

			_s3Client = s3Client;

		}

		[HttpGet("{companyID}")]
		public async Task<JsonResult> GetGosts(uint companyID)
		{
			return JSON(await _gostService.GetGostsAsync(companyID));
		}

		[HttpPost]
		public async Task<JsonResult> GetGosts([FromBody] GetGostsDto getParams)
		{
			return JSON(await _gostService.GetGostsAsync(getParams));
		}

		[HttpPost]
		public async Task<JsonResult> GetGostsRange([FromBody] GetGostsInRangeDto getGostsInRangeDto)
		{
			return JSON(await _gostService.GetGostsRangeAsync(getGostsInRangeDto));
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetGost(uint gostID)
		{
			return JSON(await _gostService.GetFullGostAsync(gostID));
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetGostName(uint gostID)
		{
			return JSON(await _gostService.GetGostNameAsync(gostID));
		}

		[HttpPost]
		public async Task<JsonResult> AddGost([FromBody] GostAddDto gostAddDto)
		{
			return JSON(await _gostService.AddGostAsync(gostAddDto));
		}

		[HttpPost]
		public async Task<JsonResult> AddFileToGost(IFormFile gostFile, uint gostID)
		{
			return JSON(await _gostService.AddFileToGostAsync(gostFile, gostID));
		}

		[HttpPost]
		public async Task<JsonResult> ChangeFileToGost(IFormFile gostFile, uint gostID)
		{
			return JSON(await _gostService.ChangeFileToGostAsync(gostFile, gostID));
		}

		[HttpPut]
		public async Task<JsonResult> EditGost([FromBody] GostEditDto gostEditDto)
		{
			return JSON(await _gostService.EditGostAsync(gostEditDto));
		}

		[HttpDelete]
		[Route("{id}")]
		public async Task<IActionResult> DeleteGost(uint id)
		{
			if (await _gostService.TryDeleteGostAsync(id))
				return Ok();

			return BadRequest();
		}

		[HttpGet("{userID}")]
		public async Task<JsonResult> GetFavouritesGosts(uint userID)
		{
			return JSON(await _gostService.GetFavouritesGostsAsync(userID));
		}

		[HttpPost]
		public async Task<JsonResult> GetFavouritesGosts([FromBody] GetFavouriteGostsDto getParams)
		{
			return JSON(await _gostService.GetFavouritesGostsListAsync(getParams));
		}

		[HttpPut]
		public async Task<IActionResult> ChangeFavouriteGost([FromQuery] uint gostID, uint userID, bool isFavourite)
		{
			if (isFavourite)
			{
				var favouriteGost = await _gostService.AddFavouriteGostAsync(gostID, userID);
				return Ok(favouriteGost);
			}
			else
			{
				if (await _gostService.TryDeleteFavouriteGostAsync(gostID, userID))
					return Ok();
				return BadRequest();
			}
		}

		[HttpGet("{userID}/{gostID}")]
		public async Task<JsonResult> CheckFavouriteAndArchiveGost(uint userID, uint gostID)
		{
			return JSON(await _gostService.CheckFavouriteAndArchiveGostAsync(userID, gostID));
		}

		[HttpPost]
		public async Task<JsonResult> AddRequest([FromQuery] uint gostID)
		{
			return JSON(await _gostService.AddRequestAsync(gostID));
		}

		[HttpPut]
		public async Task<IActionResult> ChangeArchiveGost([FromQuery] uint gostID, bool isArchived)
		{
			var gost = await _gostService.ArchiveGostAsync(gostID, isArchived);
			if (gost == null)
				return NotFound();
			return Ok(gost);
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetUpdateGostDates(uint gostID)
		{
			return JSON(await _gostService.GetUpdateGostDate(gostID));
		}

		[HttpGet]
		public async Task<JsonResult> GetDataForNormativeReferences([FromQuery]uint companyID, uint? gostID)
		{
			return JSON(await _gostService.GetDataForNormativeReferencesAsync(companyID, gostID));
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetGostFile(uint gostID)
		{
			return JSON(await _gostService.GetGostFileAsync(gostID));
		}
	}
}