using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace WebApplication.Models
{
    public class NoticesRepository
    {
        private readonly ApplicationContext _context;

        public NoticesRepository(ApplicationContext context)
        {
            _context = context;
        }

        public object[] GetNotices(int currentId)
        {
            return _context.Notices
                .Where(prop => prop.UserId == currentId)
                .OrderByDescending(prop => prop.NoticeId)
                .Select(prop => new
                {
                    noticeId = prop.NoticeId,
                    sender = prop.Sender,
                    action = prop.Action,
                    isRead = prop.IsRead,
                    time = prop.Time
                })
                .ToArray();
        }

        public void ReadNotices(int currentId)
        {
            List<Notice> notices = _context.Notices.Include(i => i.User).ToList();
            foreach (Notice notice in notices)
            {
                if (notice.UserId == currentId)
                {
                    notice.IsRead = true;
                }
            }
            _context.SaveChanges();
        }

        public void ReadNotice(int noticeId, bool isRead)
        {
            Notice notice = _context.Notices.Find(noticeId);
            notice.IsRead = isRead;
            _context.SaveChanges();
        }

        public void DeleteNotice(int noticeId)
        {
            _context.Notices.Remove(_context.Notices.Find(noticeId));
            _context.SaveChanges();
        }
    }
}
