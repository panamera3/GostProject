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

        [HttpPost]
        public async Task<JsonResult> AddFavouriteGost([FromQuery] uint gostID, uint userID)
        {
            return JSON(await _gostService.AddFavouriteGostAsync(gostID, userID));
        }
    }
}