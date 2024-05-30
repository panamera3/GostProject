using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Company;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services.Auth;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace GostProjectAPI.Services
{
	public class UserService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly IPasswordHasherService _passwordHasher;
		private readonly IOptions<AuthOptions> _authOptions;

		public UserService(IPasswordHasherService passwordEncoder, GostDBContext dbContext, IMapper mapper, IOptions<AuthOptions> authOptions)
		{
			_passwordHasher = passwordEncoder;
			_dbContext = dbContext;
			_mapper = mapper;
			_authOptions = authOptions;
		}

		public async Task<User?> AddUserAsync(UserAddDto userDTO)
		{
			var isLoginExist = await _dbContext.Users.AnyAsync(u => u.Login == userDTO.Login);
			var isCodeExist = !(await _dbContext.Companies.AnyAsync(c => c.Code == userDTO.CompanyCode));
			if (isLoginExist || isCodeExist)
				throw new Exception(isLoginExist ? "Такой логин уже существует" : "Неверный код организации");


			var company = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Code == userDTO.CompanyCode);
			var user = _mapper.Map<UserAddDto, User>(userDTO);

			user.PasswordHash = _passwordHasher.Encode(userDTO.Password);
			user.WorkCompanyID = company.ID;

			await _dbContext.Users.AddAsync(user);
			await _dbContext.SaveChangesAsync();


			return user;
		}

		public async Task CreateNotification(User user)
		{
			Notification notification = new()
			{
				SendingDate = DateTime.Now,
				CompanyId = user.WorkCompanyID,
				UserId = user.ID
			};

			await _dbContext.Notifications.AddAsync(notification);
			await _dbContext.SaveChangesAsync();
		}

		public async Task MarkNotificationsAsRead(User companyAdmin)
		{
			NotificationsLastSeen notificationLastSeen = new()
			{
				LastSeenDate = DateTime.Now,
				UserId = companyAdmin.ID
			};

			await _dbContext.NotificationsLastSeen.AddAsync(notificationLastSeen);
			await _dbContext.SaveChangesAsync();
		}

		public async Task<List<User>?> GetUsersAsync()
		{
			return await _dbContext.Users.ToListAsync();
		}

		public async Task<User?> GetUserAsync(uint userID)
		{
			return await _dbContext.Users.FirstOrDefaultAsync(u => u.ID == userID);
		}

		public async Task<List<User>?> FilterUsersAsync(string fullname)
		{
			var fullNameParts = fullname.Split(' ');

			return await _dbContext.Users.Where(u => u.LastName.Contains(fullNameParts[0]) || (fullNameParts.Length > 1 && u.FirstName.Contains(fullNameParts[1])) || (fullNameParts.Length > 2 && u.Patronymic.Contains(fullNameParts[2]))).ToListAsync();
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
			_mapper.Map(userEditDto, oldUser);

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
	}
}