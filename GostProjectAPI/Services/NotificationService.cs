using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

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
	}
}
