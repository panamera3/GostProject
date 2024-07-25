using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
	[ApiController]
	[Route("/api/[controller]/[action]")]
	public class KeysController : CommonControllerBase
	{
		private readonly KeysService _keysService;

		public KeysController(KeysService keysService)
		{
			_keysService = keysService;
		}

		[HttpGet("{companyID}")]
		public async Task<JsonResult> GetUniqueKeywords(uint companyID)
		{
			return JSON(await _keysService.GetUniqueKeywordsAsync(companyID));
		}

		[HttpGet("{companyID}")]
		public async Task<JsonResult> GetUniqueKeyphrases(uint companyID)
		{
			return JSON(await _keysService.GetUniqueKeyphrasesAsync(companyID));
		}
	}
}
