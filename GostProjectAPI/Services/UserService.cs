using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

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

		public async Task<List<User>?> FilterUsersAsync(FilterUsers filterUsers)
		{
			var users = _dbContext.Users.AsQueryable();

			var result = users;

			if (filterUsers.Fullname != null)
			{
				var fullNameParts = filterUsers.Fullname.Split(' ');
				result = result.Where(u =>
										(fullNameParts.Length == 1 &&
											(u.LastName.Contains(fullNameParts[0]) ||
											u.FirstName.Contains(fullNameParts[0]) ||
											u.Patronymic.Contains(fullNameParts[0]))
										) ||
										(fullNameParts.Length == 2 &&
											(u.LastName.Contains(fullNameParts[0]) &&
											u.FirstName.Contains(fullNameParts[1]))
										) ||
										(fullNameParts.Length == 3 &&
											(u.LastName.Contains(fullNameParts[0]) &&
											u.FirstName.Contains(fullNameParts[1]) &&
											u.Patronymic.Contains(fullNameParts[2]))
										)
									).AsQueryable();

			}

			if (filterUsers.Department != null)
			{
				result = result.Where(u => u.Department.Contains(filterUsers.Department)).AsQueryable();
			}

			return await result.ToListAsync();
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
				oldUser.Login = userEditDto.Login;

			if (userEditDto.Department != null)
				oldUser.Department = userEditDto.Department;

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
			return _dbContext.Users
					.Select(u => u.Department)
					.Distinct()
					.ToList();
		}
	}
}