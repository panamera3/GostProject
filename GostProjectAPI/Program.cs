using Amazon.S3;
using GostProjectAPI.Data;
using GostProjectAPI.Services;
using GostProjectAPI.Services.Auth;
using GostProjectAPI.Services.Background;
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
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			// Add MySql DB
			// var nameConString = "MySqlConStringPublic";
			var nameConString = builder.Environment.IsProduction() ? "MySqlConStringPublic" : "MySqlConString";
			var conString = builder.Configuration.GetConnectionString(nameConString);
			builder.Services.AddDbContext<GostDBContext>(option => option.UseMySql(conString, new MySqlServerVersion(new Version(10, 4, 24))));

			// ¬ÔËÒ˚‚‡Ú¸ ÌÓ‚˚Â ÒÂ‚ËÒ˚
			builder.Services.AddSingleton<ICompanyCodeHasherService, SHA256CompanyCodeHasherService>();
			builder.Services.AddSingleton<ICompanyCodeHasherService, SHA256CompanyCodeHasherService>();
			builder.Services.AddSingleton<IPasswordHasherService, SHA256PasswordHasherService>();
			builder.Services.Configure<AuthOptions>(builder.Configuration.GetSection("Auth"));
			var authConfig = builder.Configuration.GetSection("Auth").Get<AuthOptions>();

			// ƒÀﬂ –¿¡Œ“€ — ’–¿Õ»À»Ÿ≈Ã
			var awsOptions = builder.Configuration.GetAWSOptions();
			builder.Services.AddDefaultAWSOptions(awsOptions);
			builder.Services.AddAWSService<IAmazonS3>();


			builder.Services.AddScoped<GostService>();
			builder.Services.AddScoped<UserService>();
			builder.Services.AddScoped<AuthService>();
			builder.Services.AddScoped<NotificationService>();
			builder.Services.AddScoped<CompanyService>();
			builder.Services.AddScoped<KeysService>();

			builder.Services.AddHostedService<UpdateCompanyCodeService>();

			builder.Services.AddAuthentication(options =>
			{
				options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
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
				options.Events = new JwtBearerEvents
				{
					OnMessageReceived = context =>
					{
						context.Token = context.Request.Cookies["token"];
						return Task.CompletedTask;
					}
				};
			});

			builder.Services.AddAuthorization();
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen(c =>
			{
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

			builder.Services.AddControllers().AddJsonOptions(options =>
			{
				options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
			});

			builder.Services.AddCors();

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			/*
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}
			*/

			app.UseSwagger();
			app.UseSwaggerUI();

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseRouting();

			app.UseCors(options =>
			{
				options.WithOrigins("http://77.232.139.251:3000", "http://localhost:3000")
					   .AllowAnyMethod()
					   .AllowAnyHeader()
					   .AllowCredentials();
			});

			app.UseAuthentication();
			app.UseAuthorization();

			app.MapControllers();
			app.MapControllerRoute(
				name: "default",
				pattern: "{controller=Auth}/{action=Index}/{id?}");

			app.Run();
		}
	}
}
