using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class UserController : CommonControllerBase
    {
        private readonly UserService _usersService;

        public UserController(UserService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        public async Task<JsonResult> GetUsers()
        {
            return JSON(await _usersService.GetUsersAsync());
        }

        [HttpGet("{userID}")]
        public async Task<JsonResult> GetUser(uint userID)
        {
            return JSON(await _usersService.GetUserAsync(userID));
        }
    }
}
