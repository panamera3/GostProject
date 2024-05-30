using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Notification;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace GostProjectAPI.Services
{
	public class NotificationService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;

		public NotificationService(GostDBContext dbContext, IMapper mapper)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}

		public async Task<List<NotificationDto>> GetNotificationsAsync(uint companyID)
		{
			var notifications = await _dbContext.Notifications
				.Where(n => n.CompanyId == companyID)
				.Select(n => new NotificationDto
				{
					ID = n.ID,
					SendingDate = n.SendingDate,
					CompanyId = n.CompanyId,
					User = new NotificationUserDto
					{
						ID = n.User.ID,
						FullName = $"{n.User.LastName} {n.User.FirstName} {n.User.Patronymic}",
						Login = n.User.Login,
						Department = n.User.Department,
						Role = n.User.Role
					}
				})
				.ToListAsync();

			return notifications;
		}

		public async Task<NotificationDto> GetNotificationAsync(uint notificationID)
		{
			var notification = await _dbContext.Notifications
				.Where(n => n.ID == notificationID)
				.Select(n => new NotificationDto
				{
					ID = n.ID,
					SendingDate = n.SendingDate,
					CompanyId = n.CompanyId,
					User = new NotificationUserDto
					{
						ID = n.User.ID,
						FullName = $"{n.User.LastName} {n.User.FirstName} {n.User.Patronymic}",
						Login = n.User.Login,
						Department = n.User.Department,
						Role = n.User.Role
					}
				})
				.FirstOrDefaultAsync();

			return notification;
		}

		public async Task<NotificationsLastSeen> GetNotificationsLastSeenAsync(uint userID)
		{
			var notificationsLastSeen = _dbContext.NotificationsLastSeen.Where(n => n.UserId == userID).OrderByDescending(n => n.LastSeenDate)
		.FirstOrDefault();

			return notificationsLastSeen;
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

		public async Task<NotificationsLastSeen> MarkNotificationsAsRead(uint userID)
		{
			NotificationsLastSeen notificationLastSeen = new()
			{
				LastSeenDate = DateTime.Now,
				UserId = userID
			};

			await _dbContext.NotificationsLastSeen.AddAsync(notificationLastSeen);
			await _dbContext.SaveChangesAsync();

			return notificationLastSeen;
		}


		public async Task<bool> AcceptUserAsync(uint notificationID)
		{
			var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.ID == notificationID);
			if (notification == null)
				return false;

			var user = await _dbContext.Users.FindAsync(notification.UserId);
			if (user == null)
				return false;

			user.IsConfirmed = true;

			_dbContext.Users.Update(user);
			await _dbContext.SaveChangesAsync();

			_dbContext.Notifications.Remove(notification);
			await _dbContext.SaveChangesAsync();
			return true;
		}
	}
}
