using GostProjectAPI.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Data
{
    public class GostDBContext: DbContext
    {
        public DbSet<Gost> Gosts { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Company> Companies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
