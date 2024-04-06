using GostProjectAPI.Data.Entities;
using GostProjectAPI.Data;
using GostProjectAPI.DTOModels.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace GostProjectAPI.Services.Auth
{
    public class AuthService
    {
        private readonly IPasswordHasherService _passwordHasher;
        private readonly GostDBContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IOptions<AuthOptions> _authOptions;

        public AuthService(IPasswordHasherService passwordEncoder, GostDBContext dbContext, IMapper mapper, IOptions<AuthOptions> authOptions)
        {
            _passwordHasher = passwordEncoder;
            _dbContext = dbContext;
            _mapper = mapper;
            _authOptions = authOptions;
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

            return signedInUser;
        }
        
        private ClaimsIdentity GetIdentity(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", user.ID.ToString()),
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role.ToString()),
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
    }
}
