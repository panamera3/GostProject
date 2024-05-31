using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GostProjectAPI.Data.Entities
{
    public class FavouriteGost
    {
        [Description("ID")]
        [Key]
        public uint ID { get; set; }

        public uint UserId { get; set; }
        public User User { get; set; }

        public uint GostId { get; set; }
        public Gost Gost { get; set; }
    }
}
