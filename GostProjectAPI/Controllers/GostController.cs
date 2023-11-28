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

        [HttpGet("{orderID}")]
        public async Task<JsonResult> GetGost(int gostID)
        {
            return JSON(await _gostService.GetGostAsync(gostID));
        }
    }
}