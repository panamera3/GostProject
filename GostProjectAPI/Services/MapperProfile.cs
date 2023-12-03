using GostProjectAPI.Data.Entities;
using GostProjectAPI.DTOModels.Gosts;

namespace GostProjectAPI.Services
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Gost, GostAddDto>();
            CreateMap<Gost, GostEditDto>();
        }
    }
}
