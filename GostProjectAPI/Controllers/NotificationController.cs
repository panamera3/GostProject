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

		[HttpPost]
		public async Task<JsonResult> ReadNotifications([FromQuery] uint userID)
		{
			return JSON(await _notificationService.MarkNotificationsAsRead(userID));
		}
	}
}
