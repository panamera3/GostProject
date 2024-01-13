using GostProjectAPI.Data;
using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Users;
using GostProjectAPI.Services.Auth;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GostProjectAPI.Services
{
    public class UsersService
    {
        private readonly IMapper _mapper;
        private readonly GostDBContext _dbContext;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IOptions<AuthOptions> _authOptions;

        public UsersService(IPasswordHasherService passwordEncoder, GostDBContext dbContext, IMapper mapper, IOptions<AuthOptions> authOptions)
        {
            _passwordHasher = passwordEncoder;
            _dbContext = dbContext;
            _mapper = mapper;
            _authOptions = authOptions;
        }

        public async Task<User?> AddUserAsync(UserAddDto userDTO)
        {
            if (await _dbContext.Users.AnyAsync(u => u.Login == userDTO.Login) || await _dbContext.Companies.AnyAsync(c => c.Code != userDTO.CompanyCode))
                return null;

            var user = _mapper.Map<UserAddDto, User>(userDTO,
                opt => opt.AfterMap(async (src, dest) =>
                {
                    dest.PasswordHash = _passwordHasher.Encode(src.Password);
                    dest.WorkCompanyID = (await _dbContext.Companies.FirstOrDefaultAsync(c => c.Code == userDTO.CompanyCode)).ID;
                })
            );

            if (user == null)
                return null;

            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        
    }
}
