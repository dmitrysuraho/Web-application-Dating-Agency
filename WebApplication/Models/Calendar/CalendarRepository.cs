using System;
using System.Linq;

namespace WebApplication.Models
{
    public class CalendarRepository
    {
        private readonly ApplicationContext _context;

        public CalendarRepository(ApplicationContext context)
        {
            _context = context;
        }

        public Settings GetSettings(int userId)
        {
            return _context.Settings.Find(userId);
        }

        public void ChangeSettings(int userId, Settings newSettings)
        {
            Settings settings = _context.Settings.Find(userId);
            settings.DateFormat = newSettings.DateFormat;
            settings.TimeFormat = newSettings.TimeFormat;
            settings.StartWeekOn = newSettings.StartWeekOn;
            _context.SaveChanges();
        }

        public object[] GetCalendars(int userId)
        {
            return _context.Calendars.Where(prop => prop.UserId == userId)
                 .Select(prop => new { prop.Id, prop.Title, prop.Color, prop.Visible }).ToArray();
        }

        public Calendar AddCalendars(User user, Calendar calendar)
        {
            calendar.User = user;
            _context.Calendars.Add(calendar);
            _context.SaveChanges();
            return calendar;
        }

        public object ChangeCalendars(int calendarId, Calendar newCalendar)
        {
            Calendar calendar = _context.Calendars.Find(calendarId);
            calendar.Title = newCalendar.Title;
            calendar.Color = newCalendar.Color;
            calendar.Visible = newCalendar.Visible;
            _context.SaveChanges();
            return new
            {
                id = calendar.Id,
                title = calendar.Title,
                color = calendar.Color,
                visible = calendar.Visible
            };
        }

        public void DeleteCalendars(int calendarId)
        {
            Calendar calendar = _context.Calendars.Find(calendarId);
            if (calendar == null) return;
            _context.Calendars.Remove(calendar);
            Event[] events = _context.Events.Where(prop => prop.CalendarId == calendarId).ToArray();
            _context.Events.RemoveRange(events);
            _context.SaveChanges();
        }

        public object[] GetEvents(int userId)
        {
            return _context.Events.Where(prop => prop.UserId == userId)
                 .Select(prop => new { prop.Id, prop.CalendarId, prop.Title, prop.Description, prop.Start, prop.End, prop.AllDay }).ToArray();
        }

        public object AddEvents(User user, Event calendarEvent)
        {
            calendarEvent.User = user;
            _context.Events.Add(calendarEvent);
            _context.SaveChanges();
            return new { calendarEvent.Id, calendarEvent.CalendarId, calendarEvent.Title,
                         calendarEvent.Description, calendarEvent.Start,
                         calendarEvent.End, calendarEvent.AllDay };
        }

        public object ChangeEvents(int eventId, Event newEvent)
        {
            Event changeEvent = _context.Events.Find(eventId);
            changeEvent.CalendarId = newEvent.CalendarId;
            changeEvent.Title = newEvent.Title;
            changeEvent.Description = newEvent.Description;
            changeEvent.Start = newEvent.Start;
            changeEvent.End = newEvent.End;
            changeEvent.AllDay = newEvent.AllDay;
            _context.SaveChanges();
            return new
            {
                changeEvent.Id,
                changeEvent.CalendarId,
                changeEvent.Title,
                changeEvent.Description,
                changeEvent.Start,
                changeEvent.End,
                changeEvent.AllDay
            };
        }

        public void DeleteEvents(int eventId)
        {
            Event deleteEvent = _context.Events.Find(eventId);
            _context.Events.Remove(deleteEvent);
            _context.SaveChanges();
        }
    }
}
