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

		[HttpGet]
		public async Task<JsonResult> GetUniqueKeywords()
		{
			return JSON(await _keysService.GetUniqueKeywordsAsync());
		}

		[HttpGet]
		public async Task<JsonResult> GetUniqueKeyphrases()
		{
			return JSON(await _keysService.GetUniqueKeyphrasesAsync());
		}
	}
}
