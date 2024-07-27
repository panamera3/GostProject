using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.ComponentModel.Design;

namespace GostProjectAPI.Services
{
	public class UserService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly IPasswordHasherService _passwordHasher;
		private readonly IOptions<AuthOptions> _authOptions;
		private readonly CurrentUserService _currentUserService;

		public UserService(IPasswordHasherService passwordEncoder, GostDBContext dbContext, IMapper mapper, IOptions<AuthOptions> authOptions, CurrentUserService currentUserService)
		{
			_passwordHasher = passwordEncoder;
			_dbContext = dbContext;
			_mapper = mapper;
			_authOptions = authOptions;
			_currentUserService = currentUserService;
		}

		public async Task<User?> AddUserAsync(UserAddDto userDTO)
		{
			var isPhoneNumberExist = await _dbContext.Users.AnyAsync(u => u.Login == userDTO.PhoneNumber);
			if (isPhoneNumberExist)
				throw new Exception("Такой номер телефона уже зарегистрирован");

			var isLoginExist = await _dbContext.Users.AnyAsync(u => u.Login == userDTO.Login);
			if (isLoginExist)
				throw new Exception("Такой логин уже зарегистрирован");

			var isCodeExist = !(await _dbContext.Companies.AnyAsync(c => c.Code == userDTO.CompanyCode));
			if (isCodeExist)
				throw new Exception("Неверный код организации");


			var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Code == userDTO.CompanyCode);
			var user = _mapper.Map<UserAddDto, User>(userDTO);

			user.PasswordHash = _passwordHasher.Encode(userDTO.Password);
			user.WorkCompanyID = company.ID;
			user.Department = (user.Department != null && user.Department != "") ? user.Department : "Нет отдела";

			await _dbContext.Users.AddAsync(user);
			await _dbContext.SaveChangesAsync();


			return user;
		}

		public async Task<List<User>?> GetUsersAsync()
		{
			var companyId = _currentUserService.CompanyId;
			return await _dbContext.Users.Where(u => u.WorkCompanyID == companyId).ToListAsync();
		}

		public async Task<User?> GetUserAsync(uint userID)
		{
			var users = await GetUsersAsync();
			return users?.FirstOrDefault(u => u.ID == userID);
		}

		public async Task<List<User>?> FilterUsersAsync(FilterUsers filterUsers)
		{
			var users = await GetUsersAsync();

			if (!string.IsNullOrEmpty(filterUsers.Fullname))
			{
				var fullNameParts = filterUsers.Fullname.Split(' ');
				users = users.Where(u =>
					(fullNameParts.Length == 1 &&
					 (u.LastName.ToLower().Contains(fullNameParts[0]) ||
					  u.FirstName.ToLower().Contains(fullNameParts[0]) ||
					  u.Patronymic.ToLower().Contains(fullNameParts[0]))) ||
					(fullNameParts.Length == 2 &&
					 (u.LastName.ToLower().Contains(fullNameParts[0]) &&
					  u.FirstName.ToLower().Contains(fullNameParts[1]))) ||
					(fullNameParts.Length == 3 &&
					 (u.LastName.ToLower().Contains(fullNameParts[0]) &&
					  u.FirstName.ToLower().Contains(fullNameParts[1]) &&
					  u.Patronymic.ToLower().Contains(fullNameParts[2])))).ToList();
			}

			if (!string.IsNullOrEmpty(filterUsers.Department))
			{
				users = users.Where(u => u.Department.Contains(filterUsers.Department)).ToList();
			}

			return users;
		}

		public async Task<bool> TryDeleteUserAsync(uint userID)
		{
			var user = await GetUserAsync(userID);

			if (user == null)
				return false;

			_dbContext.Users.Remove(user);
			await _dbContext.SaveChangesAsync();
			return true;
		}

		public async Task<User?> EditUserAsync(UserEditDto userEditDto)
		{
			var oldUser = await GetUserAsync(userEditDto.ID);

			if (userEditDto == null)
				return null;

			if (userEditDto.Login != null)
			{
				var isPhoneNumberExist = await _dbContext.Users.AnyAsync(u => u.Login == userEditDto.PhoneNumber);
				if (isPhoneNumberExist)
					throw new Exception("Такой номер телефона уже существует");
				oldUser.Login = userEditDto.Login;
			}

			if (userEditDto.PhoneNumber != null)
			{
				var isPhoneNumberExist = await _dbContext.Users.AnyAsync(u => u.Login == userEditDto.PhoneNumber);
				if (isPhoneNumberExist)
					throw new Exception("Такой номер телефона уже существует");
				oldUser.PhoneNumber = userEditDto.PhoneNumber;
			}

			if (userEditDto.Department != null)
				oldUser.Department = userEditDto.Department;
			if(userEditDto.Department == null || userEditDto.Department == "")
				oldUser.Department = "Нет отдела";

			if (userEditDto.Role != null)
				oldUser.Role = (Data.Enums.UserRole)userEditDto.Role;

			if (userEditDto.FullName != null)
			{
				var fullNameParts = userEditDto.FullName.Split(' ');
				oldUser.LastName = fullNameParts[0];
				oldUser.FirstName = fullNameParts[1];
				oldUser.Patronymic = fullNameParts.Length > 2 ? fullNameParts[2] : "";
			}

			_dbContext.Users.Update(oldUser);

			await _dbContext.SaveChangesAsync();

			return oldUser;
		}

		public async Task<List<string>> GetUniqueDepartmentsAsync()
		{
			return (await GetUsersAsync())
					.Select(u => u.Department)
					.Distinct()
					.ToList();
		}
	}
}