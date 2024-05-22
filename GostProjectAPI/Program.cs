using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.Services;
using GostProjectAPI.Services.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

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

            // Вписывать новые сервисы
            builder.Services.AddSingleton<IPasswordHasherService, SHA256PasswordHasherService>();
            builder.Services.Configure<AuthOptions>(builder.Configuration.GetSection("Auth"));
            var authConfig = builder.Configuration.GetSection("Auth").Get<AuthOptions>();



            // взятие пути для pdf файлов
			builder.Services.Configure<FileUploadPaths>(builder.Configuration.GetSection("FileUploadPaths"));
			var fileUploadPaths = builder.Configuration.GetSection("FileUploadPaths").Get<FileUploadPaths>();



			builder.Services.AddScoped<GostService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<AuthService>();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudience = authConfig.Audience,
                    ValidateLifetime = true,
                    IssuerSigningKey = authConfig.SecurityKey,
                    ValidateIssuerSigningKey = true
                };
            });

            builder.Services.AddAuthorization();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
                var jwtSecurityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Description = "Put your JWT Bearer token on textbox",
                    Reference = new OpenApiReference
                    {
                        Id = "oauth2",
                        Type = ReferenceType.SecurityScheme
                    }
                };

                c.AddSecurityDefinition("oauth2", jwtSecurityScheme);
                c.OperationFilter<SecurityRequirementsOperationFilter>();
            });

            builder.Services.AddControllers().AddJsonOptions(options => {
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            });


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