using GostProjectAPI.Data;
using GostProjectAPI.Services.Auth;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Services.Background
{
	public class UpdateCompanyCodeService : IHostedService, IDisposable
	{
		private Timer _timer;
		private readonly IServiceScopeFactory _scopeFactory;

		public UpdateCompanyCodeService(IServiceScopeFactory scopeFactory)
		{
			_scopeFactory = scopeFactory;
		}

		public Task StartAsync(CancellationToken cancellationToken)
		{
			var now = DateTime.Now;
			var nextRunTime = new DateTime(now.Year, now.Month, now.Day).AddDays(1);
			var initialDelay = nextRunTime - now;
			_timer = new Timer(UpdateCompanyCodes, null, initialDelay, TimeSpan.FromDays(1));
			return Task.CompletedTask;
		}

		private async void UpdateCompanyCodes(object state)
		{
			using (var scope = _scopeFactory.CreateScope())
			{
				var dbContext = scope.ServiceProvider.GetRequiredService<GostDBContext>();
				var companyCodeHasherService = scope.ServiceProvider.GetRequiredService<ICompanyCodeHasherService>();

				var companiesToUpdate = await dbContext.Companies
					.Where(c => c.UpdateDateCode <= DateTime.Now)
					.ToListAsync();

				foreach (var company in companiesToUpdate)
				{
					company.Code = companyCodeHasherService.Encode(16); // Генерация нового кода
					company.UpdateDateCode = DateTime.Now.AddMonths(company.CodeUpdateFrequencyInMonths); // Обновление даты следующего обновления
				}

				await dbContext.SaveChangesAsync();
			}
		}

		public Task StopAsync(CancellationToken cancellationToken)
		{
			_timer?.Change(Timeout.Infinite, 0);
			return Task.CompletedTask;
		}

		public void Dispose()
		{
			_timer?.Dispose();
		}
	}
}