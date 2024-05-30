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

		[HttpPost]
		public async Task<JsonResult> FilterUsers([FromBody]string fullName)
		{
			return JSON(await _usersService.FilterUsersAsync(fullName));
		}

		[HttpDelete("{userID}")]
		public async Task<IActionResult> DeleteUser(uint userID)
		{
			if (await _usersService.TryDeleteUserAsync(userID))
				return Ok();

			return BadRequest();
		}
	}
}
