using GostProjectAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
	// [Authorize]
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
		public async Task<JsonResult> GetCompanies()
		{
			return JSON(await _companyService.GetCompaniesAsync());
		}


		[HttpGet("{companyID}")]
		public async Task<JsonResult> GetCompany(uint companyID)
		{
			return JSON(await _companyService.GetCompanyAsync(companyID));
		}

		[HttpGet("{companyID}")]
        public async Task<JsonResult> GetCompanyCode(uint companyID)
        {
            return JSON(await _companyService.GetCompanyCodeAsync(companyID));
        }
    }
}
