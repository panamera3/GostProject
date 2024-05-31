using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GostProjectAPI.Controllers
{
    //[Authorize]
    public abstract class CommonControllerBase : ControllerBase
    {
        protected JsonResult JSON<T>(T data) => new(data);
    }
}
