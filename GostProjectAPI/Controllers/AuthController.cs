using AutoMapper;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services;
using GostProjectAPI.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;

namespace GostProjectAPI.Controllers
{
    [ApiController]
    [Microsoft.AspNetCore.Mvc.Route("/api/[controller]/[action]")]
    public class AuthController : CommonControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserService _usersService;
        private readonly NotificationService _notificationsService;
		private readonly IMapper _mapper;

        public AuthController(AuthService authService, UserService usersService, NotificationService notificationsService, IMapper mapper)
        {
            _authService = authService;
            _usersService = usersService;
            _mapper = mapper;
            _notificationsService = notificationsService;

		}

        [Microsoft.AspNetCore.Mvc.HttpPost]
        public async Task<JsonResult> RegisterUser([Microsoft.AspNetCore.Mvc.FromBody] UserAddDto addDto)
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
			catch (HttpResponseException ex)
			{
				return JSON(new { error = ex.Response.Content.ReadAsStringAsync().Result });
			}
		}

        [Microsoft.AspNetCore.Mvc.HttpPost]
        public async Task<JsonResult> AuthUser([Microsoft.AspNetCore.Mvc.FromBody] UserAuthDto authDto)
        {
            return JSON(await _authService.AuthenticateAsync(authDto));
        }
    }
}
