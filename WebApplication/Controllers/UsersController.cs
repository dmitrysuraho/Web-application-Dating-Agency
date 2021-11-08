using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApplication.Core.Filters;
using WebApplication.Models;
using WebApplication.Models.Users;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly ILogger<UsersController> _logger;
        private readonly UsersRepository _usersRepository;
        private readonly BlacklistsRepository _blacklistsRepository;

        public UsersController(ILogger<UsersController> logger, ApplicationContext context)
        {
            _logger = logger;
            _usersRepository = new UsersRepository(context);
            _blacklistsRepository = new BlacklistsRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpGet]
        public IActionResult GetUsers()
        {
            User user = _GetCurrentUser();
            return _JsonResult(user, true);
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpGet]
        public IActionResult GetUsers(int id)
        {
            User user = _usersRepository.FindUserById(id);
            User currentUser = _GetCurrentUser();
            if (user == null)
            {
                return NotFound(new { message = "User is not found" });
            }
            else
            {
                return _JsonResult(
                    user,
                    user.Uid == currentUser.Uid,
                    _blacklistsRepository.IsUserBlocked(currentUser.UserId, id),
                    _blacklistsRepository.IsYouBlocked(currentUser.UserId, id));
            }
        }

        [HttpPost]
        public IActionResult PostUsers([FromBody] User user)
        {
            if (_usersRepository.CheckEmailDuplicate(user))
            {
                return Conflict(new { message = "The system already has a user with a such email" });
            }
            else if (!_usersRepository.CreateUser(user))
            {
                return Json(new { message = "User with such UID has already existed" });
            }
            else
            {
                return Json(new { message = "Successfully adding" });
            }
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPut]
        public IActionResult PutUsers([FromBody] User user)
        {
            user.Uid = _GetCurrentUser().Uid;
            if (_usersRepository.CheckEmailDuplicate(user))
            {
                return Conflict(new { message = "The system already has a user with a such email", field = "email" });
            }
            else if (_usersRepository.CheckPhoneDuplicate(user))
            {
                return Conflict(new { message = "The system already has a user with a such phone", field = "phone" });
            }
            else
            {
                User updatedUser = _usersRepository.UpdateUser(user);
                return _JsonResult(updatedUser, true);
            }
        }


        [TypeFilter(typeof(AuthFilter))]
        [Route("blacklists")]
        [HttpGet]
        public IActionResult GetBlacklists()
        {
            User currentUser = _GetCurrentUser();
            return Json(_blacklistsRepository.GetBlacklists(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("blacklists/{id:int}")]
        [HttpPost]
        public IActionResult PostBlacklists(int id)
        {
            User blockUser = _usersRepository.FindUserById(id);
            User currentUser = _GetCurrentUser();
            if (blockUser == null)
            {
                return NotFound(new { message = "User not found" });
            }
            else if (currentUser.UserId == id)
            {
                return Conflict(new { message = "Cannot add yourself to blacklist" });
            }
            else
            {
                _blacklistsRepository.AddToBlacklist(currentUser, id);
                return _JsonResult(blockUser, false, true, _blacklistsRepository.IsYouBlocked(currentUser.UserId, id));
            }
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("blacklists/{id:int}")]
        [HttpDelete]
        public IActionResult DeleteBlacklists(int id)
        {
            User unblockUser = _usersRepository.FindUserById(id);
            User currentUser = _GetCurrentUser();
            if (unblockUser == null)
            {
                return NotFound(new { message = "User not found" });
            }
            else if (currentUser.UserId == id)
            {
                return Conflict(new { message = "Cannot delete yourself from blacklist" });
            }
            else
            {
                _blacklistsRepository.RemoveFromBlackList(currentUser, id);
                return _JsonResult(unblockUser, false, false, _blacklistsRepository.IsYouBlocked(currentUser.UserId, id));
            }
        }

        private User _GetCurrentUser()
        {
            string authHeader = HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Split(' ')[1];
            string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
            return _usersRepository.FindUserByUid(uid);
        }

        private IActionResult _JsonResult(User user, bool isCurrentUser, bool? isBlocked = null, bool? isYouBlocked = null)
        {
            return Json(new
            {
                id = user.UserId,
                sex = user.Sex,
                name = user.Name,
                birthday = user.Birthday,
                region = user.Region,
                photo = user.Photo,
                about = user.About,
                email = isCurrentUser ? user.Email : "",
                phone = isCurrentUser ? user.Phone: "",
                isCurrentUser = isCurrentUser,
                isBlocked = isBlocked,
                isYouBlocked = isYouBlocked
            });
        }
    }
}
