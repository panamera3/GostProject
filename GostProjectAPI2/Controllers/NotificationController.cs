using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums;
using GostProjectAPI.Migrations;
using GostProjectAPI.Services;
using Microsoft.AspNetCore.Mvc;

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
		public async Task<JsonResult> GetNotifications([FromQuery] uint companyID)
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
	}
}
