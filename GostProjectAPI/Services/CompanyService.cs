using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Company;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services.Auth;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace GostProjectAPI.Services
{
	public class CompanyService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly UserService _usersService;
		private readonly ICompanyCodeHasherService _companyCodeHasherService;

		public CompanyService(GostDBContext dbContext, IMapper mapper, UserService userService, ICompanyCodeHasherService companyCodeHasherService)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_usersService = userService;
			_companyCodeHasherService = companyCodeHasherService;
		}
		public async Task<List<Company>?> GetCompaniesAsync()
		{
			return await _dbContext.Companies.ToListAsync();
		}

		public async Task<Company?> GetCompanyAsync(uint companyID)
		{
			return await _dbContext.Companies.FirstOrDefaultAsync(c => c.ID == companyID);
		}

		public async Task<UserAddDto> AddCompanyAsync(CompanyAddDto companyAddDto)
		{
			// сначала создать компанию
			var isCompanyExist = await _dbContext.Companies.AnyAsync(c => c.PSRN == companyAddDto.PSRN);
			if (isCompanyExist)
				throw new Exception("Компания с таким ОГРН уже зарегистрирована");
			
			
			var company = _mapper.Map<CompanyAddDto, Company>(companyAddDto,
				opt => opt.AfterMap((src, dest) =>
				{
					dest.Code = _companyCodeHasherService.Encode(16);
				})
			);

			if (company == null)
				return null;

			await _dbContext.Companies.AddAsync(company);
			await _dbContext.SaveChangesAsync();
			

			var newAdmin = _mapper.Map<UserAddDto>(companyAddDto);
			newAdmin.CompanyCode = company.Code;
			
			return newAdmin;
		}

		public async Task<Company> ResetCompanyCode(uint companyId)
		{
			var company = await _dbContext.Companies.FindAsync(companyId);

			if (company == null)
				return null;
			

			company.Code = _companyCodeHasherService.Encode(16);
			await _dbContext.SaveChangesAsync();

			return company;
		}

		public async Task<string> GetCompanyCodeAsync(uint companyId)
		{
			var company = await _dbContext.Companies.FindAsync(companyId);

			if (company == null)
				return null;

			return company.Code;
		}
	}
}
