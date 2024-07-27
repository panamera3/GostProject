using Amazon.S3.Model.Internal.MarshallTransformations;
using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data.Enums;
using GostProjectAPI.DTOModels.Notification;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace GostProjectAPI.Services
{
	public class NotificationService
	{
		private readonly IMapper _mapper;
		private readonly GostDBContext _dbContext;
		private readonly UserService _usersService;
		private readonly CurrentUserService _currentUserService;

		public NotificationService(GostDBContext dbContext, IMapper mapper, UserService usersService, CurrentUserService currentUserService)
		{
			_dbContext = dbContext;
			_mapper = mapper;
			_usersService = usersService;
			_currentUserService = currentUserService;
		}

		public async Task<List<NotificationDto>> GetNotificationsAsync()
		{
			var companyId = _currentUserService.CompanyId;
			var notifications = await _dbContext.Notifications
				.Where(n => n.CompanyId == companyId)
				.Where(n => n.Status == NotificationStatus.UnderConsideration)
				.Select(n => new NotificationDto
				{
					ID = n.ID,
					SendingDate = n.SendingDate,
					CompanyId = n.CompanyId,
					User = new NotificationUserDto
					{
						ID = n.UserId,
						FullName = n.UserFullName,
						Login = n.UserLogin,
						Department = n.UserDepartment,
						Role = n.UserRole
					}
				})
				.ToListAsync();

			return notifications;
		}

		public async Task<NotificationDto?> GetNotificationAsync(uint notificationID)
		{
			var companyId = _currentUserService.CompanyId;
			var notification = await _dbContext.Notifications
				.Where(n => n.ID == notificationID && n.CompanyId == companyId)
				.Select(n => new NotificationDto
				{
					ID = n.ID,
					SendingDate = n.SendingDate,
					CompanyId = n.CompanyId,
					User = new NotificationUserDto
					{
						ID = n.UserId,
						FullName = n.UserFullName,
						Login = n.UserLogin,
						Department = n.UserDepartment,
						Role = n.UserRole
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
				Status = NotificationStatus.UnderConsideration,
				UserId = user.ID ,
				UserFullName = $"{user.LastName} {user.FirstName} {user.Patronymic}",
				UserLogin = user.Login ,
				UserDepartment = user.Department,
				UserRole = user.Role
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


		public async Task<bool> AcceptUserAsync(uint notificationID, UserRole role)
		{
			var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.ID == notificationID);
			if (notification == null)
				return false;

			var user = await _dbContext.Users.FindAsync(notification.UserId);
			if (user == null)
				return false;

			user.IsConfirmed = true;
			user.Role = role;

			_dbContext.Users.Update(user);
			await _dbContext.SaveChangesAsync();

			notification.Status = NotificationStatus.Accepted;
			_dbContext.Notifications.Update(notification);
			await _dbContext.SaveChangesAsync();

			return true;
		}

		public async Task<Notification?> GetNotificationByLoginAsync(string login)
		{
			var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.UserLogin == login);
			return notification;
		}

		public async Task<bool> RejectUserAsync(uint notificationID)
		{
			var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.ID == notificationID);
			if (notification == null)
				return false;

			notification.Status = NotificationStatus.Rejected;
			_dbContext.Notifications.Update(notification);
			await _dbContext.SaveChangesAsync();

			if (!(await _usersService.TryDeleteUserAsync(notification.UserId)))
				return false;

			return true;
		}
	}
}
