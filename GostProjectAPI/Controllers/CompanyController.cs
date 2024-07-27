using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
	[ApiController]
	[Route("/api/[controller]/[action]")]
	public class CompanyController : CommonControllerBase
	{
		private readonly CompanyService _companyService;

		public CompanyController(CompanyService companyService)
		{
			_companyService = companyService;
		}


		[HttpGet]
		public async Task<JsonResult> GetCompany()
		{
			return JSON(await _companyService.GetCompanyAsync());
		}


		[HttpPost]
		public async Task<JsonResult> ChangeCodeUpdateFrequency([FromQuery] byte months)
		{
			return JSON(await _companyService.ChangeCodeUpdateFrequencyAsync(months));
		}
	}
}
