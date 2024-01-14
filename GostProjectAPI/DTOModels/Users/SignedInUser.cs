using GostProjectAPI.Data.Enums;

namespace GostProjectAPI.DTOModels.Users
{
    public class SignedInUser
    {
        public string ID { get; set; }

        public string Token { get; set; }

        public string Login { get; set; }

        public UserRole Role { get; set; }
    }
}
