using Amazon.S3;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

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

		[HttpGet]
		public async Task<IActionResult> GetAllBuckets()
		{
			var config = new AmazonS3Config
			{
				ServiceURL = "https://s3.timeweb.cloud",
				AuthenticationRegion = "ru-1",
			};
			var s3Client = new AmazonS3Client("OEROXDNUP3Q8L16FYNMV", "SJwow3RoWBjQ5CAKqF7tfe5FLOs1ucKTs9jdJNsI", config);

			var data = await s3Client.ListBucketsAsync();
			var buckets = data.Buckets.Select(b => b.BucketName);

			return Ok(buckets);
		}

		// HttpPut
		[HttpPost]
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

		[HttpPost]
		public async Task<JsonResult> AddFavouriteGost([FromQuery] uint gostID, uint userID)
		{
			return JSON(await _gostService.AddFavouriteGostAsync(gostID, userID));
		}

		[HttpDelete]
		public async Task<IActionResult> DeleteFavouriteGost([FromQuery] uint gostID, uint userID)
		{
			if (await _gostService.TryDeleteFavouriteGostAsync(gostID, userID))
				return Ok();

			return BadRequest();
		}

		[HttpGet("{userID}/{gostID}")]
		public async Task<JsonResult> CheckFavouriteGosts(uint userID, uint gostID)
		{
			return JSON(await _gostService.CheckFavouriteGostsAsync(userID, gostID));
		}

		[HttpPost]
		public async Task<JsonResult> AddRequest([FromQuery] uint gostID)
		{
			return JSON(await _gostService.AddRequestAsync(gostID));
		}

		[HttpPost]
		public async Task<JsonResult> ArchiveGost([FromQuery] uint gostID)
		{
			return JSON(await _gostService.ArchiveGostAsync(gostID));
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetUpdateGostDates(uint gostID)
		{
			return JSON(await _gostService.GetUpdateGostDate(gostID));
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetNormativeReferences(uint gostID)
		{
			return JSON(await _gostService.GetNormativeReferencesAsync(gostID));
		}

		[HttpGet("{companyID}")]
		public async Task<JsonResult> GetDataForNormativeReferences(uint companyID)
		{
			return JSON(await _gostService.GetDataForNormativeReferencesAsync(companyID));
		}

		[HttpGet("{gostID}")]
		public async Task<JsonResult> GetGostFile(uint gostID)
		{
			return JSON(await _gostService.GetGostFileAsync(gostID));
		}
	}
}