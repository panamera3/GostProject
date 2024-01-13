using System.ComponentModel.DataAnnotations;

namespace GostProjectAPI.DTOModels.Users
{
    public class UserAuthDto
    {
        [Required]
        public string Login { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
