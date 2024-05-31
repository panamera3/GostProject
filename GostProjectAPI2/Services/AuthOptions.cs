using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace GostProjectAPI.Services
{
    public class AuthOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Key { get; set; }
        public int LifeTime { get; set; }

        public SymmetricSecurityKey SecurityKey => new(Encoding.ASCII.GetBytes(Key));
    }
}
