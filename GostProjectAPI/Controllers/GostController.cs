using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Gosts;
using Microsoft.AspNetCore.Authorization;
using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;
using GostProjectAPI.Migrations;

namespace GostProjectAPI.Controllers
{
	// [Authorize]
	[ApiController]
    [Route("/api/[controller]/[action]")]
    public class GostController : CommonControllerBase
    {
        private readonly GostService _gostService;

        public GostController(GostService gostService)
        {
            _gostService = gostService;
        }

        [HttpGet]
        public async Task<JsonResult> GetGosts()
        {
            return JSON(await _gostService.GetGostsAsync());
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
        public async Task<JsonResult> AddRequest([FromQuery]uint gostID)
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

		[HttpGet]
		public async Task<JsonResult> GetDataForNormativeReferences()
		{
			return JSON(await _gostService.GetDataForNormativeReferencesAsync());
		}
	}
}