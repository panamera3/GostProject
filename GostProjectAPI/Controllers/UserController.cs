using GostProjectAPI.DTOModels.Users;
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

        [HttpGet("{companyID}")]
        public async Task<JsonResult> GetUsers(uint companyID)
        {
            return JSON(await _usersService.GetUsersAsync(companyID));
        }

        [HttpGet("{userID}")]
        public async Task<JsonResult> GetUser(uint userID)
        {
            return JSON(await _usersService.GetUserAsync(userID));
		}

		[HttpPost]
		public async Task<JsonResult> FilterUsers([FromBody]FilterUsers filterUsers)
		{
			return JSON(await _usersService.FilterUsersAsync(filterUsers));
		}

		[HttpDelete("{userID}")]
		public async Task<IActionResult> DeleteUser(uint userID)
		{
			if (await _usersService.TryDeleteUserAsync(userID))
				return Ok();

			return BadRequest();
		}

        // HttpPut
        [HttpPost]
        public async Task<JsonResult> EditUser([FromBody] UserEditDto userEdit)
        {
            return JSON(await _usersService.EditUserAsync(userEdit));
        }

        [HttpGet("{companyID}")]
        public async Task<JsonResult> GetUniqueDepartments(uint companyID)
        {
            return JSON(await _usersService.GetUniqueDepartmentsAsync(companyID));
        }
	}
}
