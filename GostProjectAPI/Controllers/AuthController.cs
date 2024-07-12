using GostProjectAPI.DTOModels.Auth;
using GostProjectAPI.DTOModels.Company;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services;
using GostProjectAPI.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
	[AllowAnonymous]
	[ApiController]
	[Route("/api/[controller]/[action]")]
	public class AuthController : CommonControllerBase
	{
		private readonly AuthService _authService;
		private readonly UserService _usersService;
		private readonly NotificationService _notificationsService;
		private readonly CompanyService _companyService;
		private readonly IMapper _mapper;

		public AuthController(AuthService authService, UserService usersService, NotificationService notificationsService, IMapper mapper, CompanyService companyService)
		{
			_authService = authService;
			_usersService = usersService;
			_mapper = mapper;
			_notificationsService = notificationsService;
			_companyService = companyService;
		}

		[HttpPost]
		public async Task<JsonResult> RegisterUser([FromBody] UserAddDto addDto)
		{
			try
			{
				var newUser = await _usersService.AddUserAsync(addDto);
				if (newUser != null)
				{
					await _notificationsService.CreateNotification(newUser);
					return JSON(await _authService.AuthenticateAsync(_mapper.Map<UserAuthDto>(addDto)));
				}
				else
					return JSON(await _authService.AuthenticateAsync(_mapper.Map<UserAuthDto>(null)));
			}
			catch (Exception ex)
			{
				return JSON(new { error = ex.Message });
			}
		}

		[HttpPost]
		public async Task<JsonResult> AuthUser([FromBody] UserAuthDto authDto)
		{
			return JSON(await _authService.AuthenticateAsync(authDto));
		}

		[HttpPost]
		public async Task<JsonResult> RegisterCompany([FromBody] CompanyAddDto companyAddDto)
		{
			UserAddDto newAdmin = null;
			try
			{
				newAdmin = await _companyService.AddCompanyAsync(companyAddDto);
			}
			catch (Exception ex)
			{
				return JSON(new { error = ex.Message });
			}
			try
			{
				if (newAdmin != null)
				{
					newAdmin.IsConfirmed = true;
					var newUser = await _usersService.AddUserAsync(newAdmin);
					if (newUser != null)
						return JSON(await _authService.AuthenticateAsync(_mapper.Map<UserAuthDto>(newAdmin)));
					else
						return JSON(await _authService.AuthenticateAsync(_mapper.Map<UserAuthDto>(null)));
				}
				else
					return JSON(new { error = "Не удалось создать пользователя" });
			}
			catch (Exception ex)
			{
				return JSON(new { error = ex.Message });
			}
		}

		[HttpPost]
		public async Task<JsonResult> UpdateCompanyCode([FromQuery] uint companyId)
		{
			return JSON(await _companyService.ResetCompanyCode(companyId));
		}

		[HttpPost]
		public async Task<IActionResult> CheckUserAndCompany([FromBody] ExistingUserDto existingUserDto)
		{
			try
			{
				var (userExists, companyExists) = await _authService.CheckUserAndCompanyAsync(existingUserDto);

				if (!userExists || !companyExists)
				{
					return NotFound("Пользователь или компания не найдены");
				}

				return Ok();
			}
			catch (Exception)
			{
				return StatusCode(500, "Произошла ошибка на сервере. Пожалуйста, попробуйте позже.");
			}
		}
	}
}
