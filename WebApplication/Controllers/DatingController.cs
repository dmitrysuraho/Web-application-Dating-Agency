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

        public DatingController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _datingRepository = new DatingRepository(context);
            _galleriesRepository = new GalleriesRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpGet]
        public IActionResult Get(string sex, int minAge, int maxAge)
        {
            User currentUser = _GetCurrentUser();
            User candidate = _datingRepository.GetDatingUser(currentUser.UserId, sex, minAge, maxAge);
            if (candidate == null)
            {
                return NotFound(new { message = "Candidate is not found" });
            }
            else
            {
                return _JsonResult(candidate, _GalleryResult(_galleriesRepository.GetGalleries(candidate)));
            }
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPost]
        public IActionResult Post(string sex, int minAge, int maxAge, [FromBody] Dating dating)
        {
            User currentUser = _GetCurrentUser();
            if (!_datingRepository.Dating(currentUser, dating))
            {
                return Conflict(new { message = "You has already granded that candidate" });
            }
            else
            {
                User candidate = _datingRepository.GetDatingUser(currentUser.UserId, sex, minAge, maxAge);
                if (candidate == null)
                {
                    return NotFound(new { message = "Candidate is not found" });
                }
                else
                {
                    return _JsonResult(candidate, _GalleryResult(_galleriesRepository.GetGalleries(candidate)));
                }
            }
        }

        private string[] _GalleryResult(List<Gallery> galleries)
        {
            List<string> result = new List<string>();
            foreach (Gallery gallery in galleries)
            {
                result.Add(gallery.Image);
            }
            return result.ToArray();
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
