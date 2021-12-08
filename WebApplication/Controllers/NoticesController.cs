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
    public class NoticesController : Controller
    {
        private readonly UsersRepository _usersRepository;
        private readonly NoticesRepository _noticesRepository;

        public NoticesController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _noticesRepository = new NoticesRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpGet]
        public IActionResult Get()
        {
            User currentUser = _GetCurrentUser();
            return Json(_noticesRepository.GetNotices(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPut]
        public IActionResult Put()
        {
            User currentUser = _GetCurrentUser();
            _noticesRepository.ReadNotices(currentUser.UserId);
            return Json(new { message = "Notices have been read" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpPut]
        public IActionResult Put(int id, [FromBody] bool isRead)
        {
            _noticesRepository.ReadNotice(id, isRead);
            return Json(new { message = "Notice has been read" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpDelete]
        public IActionResult Delete(int id)
        {
            _noticesRepository.DeleteNotice(id);
            return Json(new { message = "Notice has been deleted" });
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
