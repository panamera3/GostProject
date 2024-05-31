using System.ComponentModel;

namespace GostProjectAPI.Data.Enums.Gost
{
    public enum AcceptanceLevel : byte
    {
        [Description("Национальный")]
        National = 1,

        [Description("Межгосударственный")]
        Interstate,

        [Description("Международный")]
        International,

        [Description("Иностранный")]
        Foreign,

        [Description("Стандарт организации")]
        Local
    }
}
