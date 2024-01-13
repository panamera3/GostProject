using System.Security.Cryptography;
using System.Text;

namespace GostProjectAPI.Services.Auth;

public class SHA256PasswordHasherService : IPasswordHasherService
{
    public string? Encode(string password)
    {
        var buffer = new byte[256];
        if (!SHA256.TryHashData(Encoding.UTF8.GetBytes(password), buffer, out var _))
            return null;

        return Convert.ToBase64String(buffer);
    }
}
