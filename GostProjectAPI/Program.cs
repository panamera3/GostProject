using GostProjectAPI.Data;
using GostProjectAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // AutoMapper configuration
            var mapper = new MapperConfiguration(mc => mc.AddProfile<MapperProfile>())
                .CreateMapper();
            builder.Services.AddSingleton(mapper);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            // Add MySql DB
            var conString = builder.Configuration.GetConnectionString("MySqlConString");
            builder.Services.AddDbContext<GostDBContext>(option => option.UseMySql(conString, new MySqlServerVersion(new Version(10, 4, 24))));

            // ��������� ����� �������
            builder.Services.AddScoped<GostService>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();

                app.UseCors(c => c
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                );
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}