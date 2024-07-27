using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Company;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services.Auth;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;
using System.Net;

namespace GostProjectAPI.Services
{
	public class CompanyService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly UserService _usersService;
		private readonly ICompanyCodeHasherService _companyCodeHasherService;
		private readonly CurrentUserService _currentUserService;

		public CompanyService(GostDBContext dbContext, IMapper mapper, UserService userService, ICompanyCodeHasherService companyCodeHasherService, CurrentUserService currentUserService)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_usersService = userService;
			_companyCodeHasherService = companyCodeHasherService;
			_currentUserService = currentUserService;
		}

		public async Task<Company?> GetCompanyAsync()
		{
			var companyId = _currentUserService.CompanyId;
			return await _dbContext.Companies.FirstOrDefaultAsync(c => c.ID == companyId);
		}

		public async Task<UserAddDto> AddCompanyAsync(CompanyAddDto companyAddDto)
		{
			var isCompanyExistByPSRN = await _dbContext.Companies.AnyAsync(c => c.PSRN == companyAddDto.PSRN);
			if (isCompanyExistByPSRN)
				throw new Exception("Компания с таким ОГРН уже зарегистрирована");

			var isCompanyExistByEmail = await _dbContext.Companies.AnyAsync(c => c.Email == companyAddDto.Email);
			if (isCompanyExistByEmail)
				throw new Exception("Компания с таким Email уже существует");

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

		public async Task<Company> ResetCompanyCode()
		{
			var companyId = _currentUserService.CompanyId;
			var company = await _dbContext.Companies.FindAsync(companyId);

			if (company == null)
				return null;
			

			company.Code = _companyCodeHasherService.Encode(16);
			await _dbContext.SaveChangesAsync();

			return company;
		}

		public async Task<string> GetCompanyCodeAsync()
		{
			var companyId = _currentUserService.CompanyId;
			var company = await _dbContext.Companies.FindAsync(companyId);

			if (company == null)
				return null;

			return company.Code;
		}

		public async Task<Company> ChangeCodeUpdateFrequencyAsync(byte months)
		{
			var companyId = _currentUserService.CompanyId;
			var oldCompany = await _dbContext.Companies.FindAsync(companyId);

			if (oldCompany == null)
				return null;

			oldCompany.CodeUpdateFrequencyInMonths = months;
			oldCompany.UpdateDateCode = DateTime.Now.AddMonths(months);

			await ResetCompanyCode();

			_dbContext.Companies.Update(oldCompany);
			await _dbContext.SaveChangesAsync();

			return oldCompany;
		}
	}
}
