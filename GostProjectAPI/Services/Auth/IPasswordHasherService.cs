namespace GostProjectAPI.Services.Auth
{
    public interface IPasswordHasherService
    {
        public string? Encode(string password);
    }
}
