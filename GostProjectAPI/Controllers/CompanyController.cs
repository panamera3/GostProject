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

        [HttpGet("{companyID}")]
        public async Task<JsonResult> GetCompanyCode(uint companyID)
        {
            return JSON(await _companyService.GetCompanyCodeAsync(companyID));
        }
    }
}
