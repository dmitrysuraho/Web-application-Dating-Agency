using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace WebApplication.Models
{
    public class UsersRepository
    {
        private readonly ApplicationContext _context;

        public UsersRepository(ApplicationContext context)
        {
            _context = context;
        }

        public User FindUserById(int id)
        {
            return _context.Users.Find(id);
        }

        public User FindUserByUid(string uid)
        {
            return _context.Users.FirstOrDefault(prop => prop.Uid == uid);
        }

        public bool CreateUser(User user)
        {
            User candidate = FindUserByUid(user.Uid);
            if (candidate != null) return false;
            _context.Users.Add(user);
            _context.SaveChanges();
            _context.Notifications.Add(new Notification
            {
                NotificationId = user.UserId,
                Communication = true,
                Email = true,
                Security = true
            });
            _context.Settings.Add(new Settings
            {
                DateFormat = "ll",
                TimeFormat = "24",
                StartWeekOn = 1,
                User = user
            });
            _context.SaveChanges();
            return true;
        }

        public User UpdateUser(User user)
        {
            User candidate = FindUserByUid(user.Uid);
            candidate.Sex = user.Sex;
            candidate.Name = user.Name;
            candidate.Birthday = user.Birthday;
            candidate.Region = user.Region;
            candidate.Photo = user.Photo;
            candidate.About = user.About;
            candidate.Email = user.Email;
            candidate.Phone = user.Phone;
            _context.SaveChanges();
            return candidate;
        }

        public Subscription GetSubscription(User user)
        {
            Subscription subscription = _context.Subscriptions.Find(user.UserId);
            if (subscription == null) return new Subscription();
            return subscription;
        }

        public Subscription BuySubscription(User user, DateTime end)
        {
            User candidate = FindUserByUid(user.Uid);
            candidate.IsPlus = true;
            Subscription oldSubscription = _context.Subscriptions.Find(user.UserId);
            if (oldSubscription == null)
            {
                Subscription subscription = new Subscription
                {
                    SubscriptionId = candidate.UserId,
                    Start = DateTime.Now,
                    End = end
                };
                _context.Subscriptions.Add(subscription);
                _context.SaveChanges();
                return subscription;
            }
            else
            {
                oldSubscription.Start = DateTime.Now;
                oldSubscription.End = end;
                _context.SaveChanges();
                return oldSubscription;
            }
            
        }

        public User CheckPlus(User user)
        {
            Subscription subscription = _context.Subscriptions.Find(user.UserId);
            if (subscription.End < DateTime.Now)
            {
                user.IsPlus = false;
                _context.SaveChanges();
            }
            return user;
        }

        public bool CheckEmailDuplicate(User user)
        {
            User dublicateUser = _context.Users.FirstOrDefault(prop => prop.Email == user.Email);
            if (dublicateUser == null ||
                dublicateUser.Uid == user.Uid ||
                string.IsNullOrEmpty(dublicateUser.Email))
                return false;
            else return true;
        }

        public bool CheckPhoneDuplicate(User user)
        {

            // TODO: Check phone with symbols
            User duplicateUser = _context.Users.FirstOrDefault(prop => prop.Phone == user.Phone);
            if (duplicateUser == null ||
                duplicateUser.Uid == user.Uid ||
                string.IsNullOrEmpty(duplicateUser.Phone))
                return false;
            else return true;
        }
    }
}
