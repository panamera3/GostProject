using AutoMapper;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services;
using GostProjectAPI.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class AuthController : CommonControllerBase
    {
        private readonly AuthService _authService;
        private readonly UsersService _usersService;
        private readonly IMapper _mapper;

        public AuthController(AuthService authService, UsersService usersService, IMapper mapper)
        {
            _authService = authService;
            _usersService = usersService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<JsonResult> RegisterUser([FromBody] UserAddDto addDto)
        {
            var _ = await _usersService.AddUserAsync(addDto);
            return JSON(await _authService.AuthenticateAsync(_mapper.Map<UserAuthDto>(addDto)));
        }

        [HttpPost]
        public async Task<JsonResult> AuthUser([FromBody] UserAuthDto authDto)
        {
            return JSON(await _authService.AuthenticateAsync(authDto));
        }
    }
}
