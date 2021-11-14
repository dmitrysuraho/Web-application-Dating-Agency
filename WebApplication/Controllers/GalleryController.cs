using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Core.Filters;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class GalleryController : Controller
    {
        private readonly UsersRepository _usersRepository;
        private readonly GalleriesRepository _galleriesRepository;

        public GalleryController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _galleriesRepository = new GalleriesRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPost]
        public IActionResult Post([FromBody] Gallery gallery)
        {
            if (_galleriesRepository.AddImage(_GetCurrentUser(), gallery))
            {
                return Json(new { message = "Image is successfully added" });
            }
            else
            {
                return Conflict(new { message = "You can't add more then 6 images" });
            }
            
        }

        private User _GetCurrentUser()
        {
            string authHeader = HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Split(' ')[1];
            string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
            return _usersRepository.FindUserByUid(uid);
        }
    }
}
