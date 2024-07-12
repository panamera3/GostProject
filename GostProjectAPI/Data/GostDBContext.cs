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

        public DbSet<NotificationsLastSeen> NotificationsLastSeen { get; set; }

        public DbSet<GostFile> GostFiles { get; set; }

        public DbSet<NormativeReference> NormativeReferences { get; set; }

        public GostDBContext(DbContextOptions opt) : base(opt) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NormativeReference>().HasKey(x => new { x.RootGostId, x.ReferenceGostId });
            modelBuilder.Entity<NormativeReference>().HasIndex(x => new { x.RootGostId, x.ReferenceGostId });
            modelBuilder.Entity<Keyword>().HasKey(x => new { x.Name, x.GostId });
            modelBuilder.Entity<Keyword>().HasIndex(x => new { x.Name, x.GostId });
			modelBuilder.Entity<Keyphrase>().HasKey(x => new { x.Name, x.GostId });
			modelBuilder.Entity<Keyphrase>().HasIndex(x => new { x.Name, x.GostId });
			modelBuilder.Entity<FavouriteGost>().HasKey(x => new { x.UserId, x.GostId });
			modelBuilder.Entity<FavouriteGost>().HasIndex(x => new { x.UserId, x.GostId });
			modelBuilder.Entity<GostFile>().HasKey(x => new { x.Path, x.GostId });
			modelBuilder.Entity<GostFile>().HasIndex(x => new { x.Path, x.GostId });
			modelBuilder.Entity<NotificationsLastSeen>().HasKey(x => new { x.LastSeenDate, x.UserId });
			modelBuilder.Entity<NotificationsLastSeen>().HasIndex(x => new { x.LastSeenDate, x.UserId });
			
			base.OnModelCreating(modelBuilder);
        }
    }
}
