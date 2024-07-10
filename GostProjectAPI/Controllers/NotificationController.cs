using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums;
using GostProjectAPI.Migrations;
using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace GostProjectAPI.Controllers
{
	[ApiController]
	[Route("/api/[controller]/[action]")]
	public class NotificationController : CommonControllerBase
	{
		private readonly NotificationService _notificationService;

		public NotificationController(NotificationService notificationService)
		{
			_notificationService = notificationService;
		}

		[HttpGet]
		public async Task<JsonResult> GetUnreadNotifications([FromQuery] uint companyID)
		{
			return JSON(await _notificationService.GetNotificationsAsync(companyID));
		}

		[HttpGet("{notificationID}")]
		public async Task<JsonResult> GetNotification(uint notificationID)
		{
			return JSON(await _notificationService.GetNotificationAsync(notificationID));
		}

		[HttpPost]
		public async Task<JsonResult> ReadNotifications([FromQuery] uint userID)
		{
			return JSON(await _notificationService.MarkNotificationsAsRead(userID));
		}
		
		[HttpPost]
		public async Task<IActionResult> AcceptUser([FromQuery] uint notificationID, UserRole role)
		{
			if (await _notificationService.AcceptUserAsync(notificationID, role))
				return Ok();

			return BadRequest();
		}

		[HttpGet("{userLogin}")]
		public async Task<JsonResult> GetNotificationByLogin(string userLogin)
		{
			return JSON(await _notificationService.GetNotificationByLoginAsync(userLogin));
		}

		[HttpPost]
		public async Task<IActionResult> RejectUser([FromQuery] uint notificationID)
		{
			if (await _notificationService.RejectUserAsync(notificationID))
				return Ok();

			return BadRequest();
		}
	}
}
