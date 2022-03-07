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
    public class CalendarController : Controller
    {
        private readonly UsersRepository _usersRepository;
        private readonly CalendarRepository _calendarRepository;

        public CalendarController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _calendarRepository = new CalendarRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("settings")]
        [HttpGet]
        public IActionResult GetSettings()
        {
            User currentUser = _GetCurrentUser();
            Settings settings = _calendarRepository.GetSettings(currentUser.UserId);
            return Json(new { settings.DateFormat, settings.TimeFormat, settings.StartWeekOn });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("settings")]
        [HttpPut]
        public IActionResult PutSettings([FromBody] Settings settings)
        {
            User currentUser = _GetCurrentUser();
            _calendarRepository.ChangeSettings(currentUser.UserId, settings);
            return Json(new { message = "Settings are changed" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("calendars")]
        [HttpGet]
        public IActionResult GetCalendars()
        {
            User currentUser = _GetCurrentUser();
            return Json(_calendarRepository.GetCalendars(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("calendars")]
        [HttpPost]
        public IActionResult PostCalendars([FromBody] Calendar calendar)
        {
            User currentUser = _GetCurrentUser();
            Calendar addedCalendar = _calendarRepository.AddCalendars(currentUser, calendar);
            return Json(new { addedCalendar.Id, addedCalendar.Title, addedCalendar.Color, addedCalendar.Visible });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("calendars/{id:int}")]
        [HttpPut]
        public IActionResult PutCalendars(int id, [FromBody] Calendar calendar)
        {
            return Json(_calendarRepository.ChangeCalendars(id, calendar));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("calendars/{id:int}")]
        [HttpDelete]
        public IActionResult DeleteCalendars(int id)
        {
            _calendarRepository.DeleteCalendars(id);
            return Json(new { message = "Calendar is deleted" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("events")]
        [HttpGet]
        public IActionResult GetEvents()
        {
            User currentUser = _GetCurrentUser();
            return Json(_calendarRepository.GetEvents(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("event")]
        [HttpPost]
        public IActionResult PostEvents([FromBody] Event calendarEvent)
        {
            User currentUser = _GetCurrentUser();
            return Json(_calendarRepository.AddEvents(currentUser, calendarEvent));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("event/{id:int}")]
        [HttpPut]
        public IActionResult PutEvents(int id, [FromBody] Event calendarEvent)
        {
            return Json(_calendarRepository.ChangeEvents(id, calendarEvent));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("event/{id:int}")]
        [HttpDelete]
        public IActionResult DeleteEvents(int id)
        {
            _calendarRepository.DeleteEvents(id);
            return Json(new { message = "Event is deleted" });
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
