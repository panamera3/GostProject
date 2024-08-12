using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data;
using GostProjectAPI.DTOModels.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using GostProjectAPI.DTOModels.Auth;
using System.Security.Cryptography;

namespace GostProjectAPI.Services.Auth
{
    public class AuthService
    {
        private readonly IPasswordHasherService _passwordHasher;
        private readonly GostDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IOptions<AuthOptions> _authOptions;
		private readonly TokenEncryptionService _tokenEncryptionService;

		public AuthService(IPasswordHasherService passwordEncoder, GostDBContext dbContext, IMapper mapper, IOptions<AuthOptions> authOptions, TokenEncryptionService tokenEncryptionService)
        {
            _passwordHasher = passwordEncoder;
            _dbContext = dbContext;
            _mapper = mapper;
            _authOptions = authOptions;
			_tokenEncryptionService = tokenEncryptionService;
        }

        public async Task<SignedInUser?> AuthenticateAsync(UserAuthDto userAuthDto)
        {
            if (userAuthDto == null)
                return null;

            var pwdHash = _passwordHasher.Encode(userAuthDto.Password) ?? "";

            if (string.IsNullOrWhiteSpace(pwdHash))
                return null;

            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Login == userAuthDto.Login && u.PasswordHash == pwdHash);

            if (user == null)
                return null;

            var identity = GetIdentity(user);
            var token = GenerateJWT(identity);
            var signedInUser = _mapper.Map<User, SignedInUser>(user);

            signedInUser.Token = token;

			var refreshToken = GenerateRefreshToken();
			await SaveRefreshTokenToDatabase(uint.Parse(signedInUser.ID), refreshToken);
			signedInUser.RefreshToken = refreshToken;

			return signedInUser;
        }

		private ClaimsIdentity GetIdentity(User user)
		{
			var claims = new List<Claim>
	        {
	        	new("UserId", user.ID.ToString()),
	        	new("CompanyId", user.WorkCompanyID.ToString()),
	        	new(ClaimsIdentity.DefaultNameClaimType, user.Login),
	        	new(ClaimsIdentity.DefaultRoleClaimType, user.Role.ToString()),
	        };

			return new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
		}

		private string GenerateJWT(ClaimsIdentity identity)
        {
            var now = DateTime.UtcNow;

            var jwt = new JwtSecurityToken(
                issuer: _authOptions.Value.Issuer,
                audience: _authOptions.Value.Audience,
                notBefore: now,
                claims: identity.Claims,
                expires: now.Add(TimeSpan.FromHours(_authOptions.Value.LifeTime)),
                signingCredentials: new SigningCredentials(_authOptions.Value.SecurityKey, SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
        
        public string GenerateRefreshToken()
        {
			var randomNumber = new byte[32];
			using var rng = RandomNumberGenerator.Create();
			rng.GetBytes(randomNumber);
			return Convert.ToBase64String(randomNumber);
		}

		private async Task SaveRefreshTokenToDatabase(uint userId, string refreshToken)
		{
			var user = await _dbContext.Users.FindAsync(userId);
			if (user != null)
			{
				user.RefreshToken = _tokenEncryptionService.Encrypt(refreshToken);
				user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(30);
				await _dbContext.SaveChangesAsync();
			}
		}

		public async Task<(bool userExists, bool companyExists)> CheckUserAndCompanyAsync(ExistingUserDto existingUserDto)
		{
			var user = await _dbContext.Users.FindAsync(existingUserDto.UserId);
			var company = await _dbContext.Companies.FindAsync(existingUserDto.CompanyId);

			return (user != null, company != null);
		}

		public async Task<(string accessToken, string refreshToken)> RefreshTokenAsync(RefreshTokenDto refreshToken)
		{
			var encryptedToken = _dbContext.Users.Where(u => u.RefreshTokenExpiry > DateTime.UtcNow && u.ID == refreshToken.UserID).Select(u => u.RefreshToken).FirstOrDefault();

			if (encryptedToken == null)
			{
				return (null, null);
			}

			var decryptedToken = _tokenEncryptionService.Decrypt(encryptedToken);

			var userRefreshToken = refreshToken.RefreshToken.Replace("%3D", "=");

			if (decryptedToken != userRefreshToken)
			{
				return (null, null);
			}

			var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.RefreshToken == encryptedToken);

			if (user == null)
			{
				return (null, null);
			}

			var identity = GetIdentity(user);
			var newAccessToken = GenerateJWT(identity);
			var newRefreshToken = GenerateRefreshToken();
			await SaveRefreshTokenToDatabase(user.ID, newRefreshToken);

			return (newAccessToken, newRefreshToken);
		}
	}
}
