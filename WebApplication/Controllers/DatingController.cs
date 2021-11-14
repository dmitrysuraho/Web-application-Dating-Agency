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
    public class DatingController : Controller
    {
        private readonly UsersRepository _usersRepository;
        private readonly DatingRepository _datingRepository;
        private readonly GalleriesRepository _galleriesRepository;
        private readonly BlacklistsRepository _blacklistsRepository;

        public DatingController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _datingRepository = new DatingRepository(context);
            _galleriesRepository = new GalleriesRepository(context);
            _blacklistsRepository = new BlacklistsRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpGet]
        public IActionResult Get()
        {
            return null;
        }

        private User _GetCurrentUser()
        {
            string authHeader = HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Split(' ')[1];
            string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
            return _usersRepository.FindUserByUid(uid);
        }

        private IActionResult _JsonResult(User user, string[] galleries)
        {
            return Json(new
            {
                userId = user.UserId,
                sex = user.Sex,
                name = user.Name,
                birthday = user.Birthday,
                region = user.Region,
                photo = user.Photo,
                about = user.About,
                gallery = galleries
            });
        }
    }
}
