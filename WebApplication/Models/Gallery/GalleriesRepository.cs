﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication.Models
{
    public class GalleriesRepository
    {
        private readonly ApplicationContext _context;

        public GalleriesRepository(ApplicationContext context)
        {
            _context = context;
        }

        public List<Gallery> GetGalleries(User user)
        {
            return _context.Galleries.Where(prop => prop.UserId == user.UserId).OrderByDescending(prop => prop.GalleryId).ToList();
        }

        public bool AddImage(User user, Gallery gallery)
        {
            int count = _context.Galleries.Count(prop => prop.UserId == user.UserId);
            if (count == 6) return false;
            _context.Galleries.Add(new Gallery
            {
                Image = gallery.Image,
                User = user
            });
            _context.SaveChanges();
            return true;
        }
    }
}
