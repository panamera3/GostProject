using System.ComponentModel;

namespace GostProjectAPI.Data.Enums.Gost
{
    public enum ActionStatus: byte
    {
        [Description("Действующий")]
        Current = 1,

        [Description("Отменён")]
        Cancelled,

        [Description("Заменён")]
        Replced
    }
}
