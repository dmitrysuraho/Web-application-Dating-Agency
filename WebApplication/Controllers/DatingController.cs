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
        public IActionResult Get(string sex, int minAge, int maxAge, string interest, string region)
        {
            User currentUser = _GetCurrentUser();
            User candidate = _datingRepository.GetDatingUser(currentUser.UserId, sex, minAge, maxAge, interest, region);
            if (candidate == null)
            {
                return NotFound(new { message = "Candidate is not found" });
            }
            else
            {
                return _JsonResult(candidate, _galleriesRepository.GetGalleries(candidate.UserId));
            }
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("favorites")]
        [HttpGet]
        public IActionResult Get()
        {
            User currentUser = _GetCurrentUser();
            return Json(_datingRepository.GetFavorites(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("favorites/{id:int}")]
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            if (_datingRepository.DeleteFavorite(_GetCurrentUser().UserId, id))
            {
                return Json(new { message = "Favorite is deleted" });
            }
            else
            {
                return NotFound(new { message = "This user is not favorite" });
            }
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPost]
        public IActionResult Post(string sex, int minAge, int maxAge, string interest, string region, [FromBody] Dating dating)
        {
            User currentUser = _GetCurrentUser();
            _datingRepository.Dating(currentUser, dating);
            User candidate = _datingRepository.GetDatingUser(currentUser.UserId, sex, minAge, maxAge, interest, region);
            if (candidate == null)
            {
                return NotFound(new { message = "Candidate is not found" });
            }
            else
            {
                return _JsonResult(candidate, _galleriesRepository.GetGalleries(candidate.UserId));
            }
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
                uid = user.Uid,
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
