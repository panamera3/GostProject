﻿using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Company;
using GostProjectAPI.DTOModels.Gosts;
using GostProjectAPI.DTOModels.Users;

namespace GostProjectAPI.Services
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Gost, GostAddDto>();
            CreateMap<GostAddDto, Gost>();
            CreateMap<GostEditDto, Gost>();
            CreateMap<UserAddDto, User>();
            CreateMap<UserAuthDto, User>();
            CreateMap<UserAddDto, UserAuthDto>();   
            CreateMap<User, SignedInUser>();

            CreateMap<string, Keyword>().ForMember(dest => dest.Name, opt => opt.MapFrom(src => src));
            CreateMap<string, Keyphrase>().ForMember(dest => dest.Name, opt => opt.MapFrom(src => src));

			CreateMap<CompanyAddDto, UserAddDto>();
			CreateMap<CompanyAddDto, Company>();
		}
    }
}
