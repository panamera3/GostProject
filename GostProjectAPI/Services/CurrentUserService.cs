namespace GostProjectAPI.Services
{
	public class CurrentUserService : ICurrentUserService
	{
		private readonly IHttpContextAccessor _httpContextAccessor;

		public CurrentUserService(IHttpContextAccessor httpContextAccessor)
		{
			_httpContextAccessor = httpContextAccessor;
		}

		public string UserId
		{
			get
			{
				var userIdClaim = _httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "UserId");
				return userIdClaim?.Value;
			}
		}

		public uint CompanyId
		{
			get
			{
				var companyIdClaim = _httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "CompanyId");
				if (companyIdClaim != null && uint.TryParse(companyIdClaim.Value, out var companyId))
				{
					return companyId;
				}
				throw new Exception("Не удалось получить компанию пользователя.");
			}
		}
	}


}
