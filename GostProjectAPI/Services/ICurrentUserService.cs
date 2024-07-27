namespace GostProjectAPI.Services
{
	public interface ICurrentUserService
	{
		string UserId { get; }
		uint CompanyId { get; }
	}
}
