using System.ComponentModel;

namespace GostProjectAPI.Data.Enums
{
    public enum UserRole: byte
    {
        [Description("Администратор")]
        Admin = 1,

        [Description("Обычный пользователь")]
        Standart
    }
}
