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
    public class NotificationsController : Controller
    {
        private readonly NotificationsRepository _notificationsRepository;

        public NotificationsController(ApplicationContext context)
        {
            _notificationsRepository = new NotificationsRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpGet]
        public IActionResult Get()
        {
            string uid = _GetCurrentUserUid();
            Notification notifications = _notificationsRepository.GetNotifications(uid);
            return _JsonResult(notifications);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPut]
        public IActionResult Put([FromBody] Notification notifications)
        {
            string uid = _GetCurrentUserUid();
            Notification updatedNotifications = _notificationsRepository.UpdateNotifications(notifications, uid);
            return _JsonResult(updatedNotifications);
        }

        private string _GetCurrentUserUid()
        {
            string authHeader = HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Split(' ')[1];
            return FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
        }

        private IActionResult _JsonResult(Notification notification)
        {
            return Json(new
            {
                id = notification.NotificationId,
                communication = notification.Communication,
                email = notification.Email,
                security = notification.Security
            });
        }
    }
}
