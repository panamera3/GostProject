using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
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

        [HttpGet("{gostID}")]
        public async Task<JsonResult> GetGost(uint gostID)
        {
            return JSON(await _gostService.GetGostAsync(gostID));
        }

        [HttpPost]
        public async Task<JsonResult> AddGost([FromBody] GostAddDto gostAddDto)
        {
            return JSON(await _gostService.AddGostAsync(gostAddDto));
        }

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
	}
}