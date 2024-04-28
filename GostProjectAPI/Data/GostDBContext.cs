using GostProjectAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Data
{
    public class GostDBContext: DbContext
    {
        public DbSet<Gost> Gosts { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Company> Companies { get; set; }
        
        public DbSet<Keyword> Keywords { get; set; }

        public DbSet<Keyphrase> Keyphrases { get; set; }

        public DbSet<FavouriteGost> FavouritesGosts { get; set; }

        public DbSet<UpdateGostDate> UpdateGostDates { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public GostDBContext(DbContextOptions opt) : base(opt) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
