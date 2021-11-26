using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication.Models
{
    public class PostsRepository
    {
        private readonly ApplicationContext _context;

        public PostsRepository(ApplicationContext context)
        {
            _context = context;
        }

        public Post FindPostById(int id)
        {
            return _context.Posts.Find(id);
        }

        public object[] GetPostsByUserId(int id)
        {
            return _context.Posts
                .Where(prop => prop.UserId == id)
                .OrderByDescending(prop => prop.PostId)
                .Select(prop => new { prop.PostId, prop.Description, prop.Image }).ToArray();
        }

        public object CreatePost(Post post, User user)
        {
            post.User = user;
            _context.Posts.Add(post);
            _context.SaveChanges();
            return new
            {
                postId = post.PostId,
                description = post.Description,
                image = post.Image
            };
        }

        public void DeletePost(int id)
        {
            _context.Posts.Remove(FindPostById(id));
            _context.SaveChanges();
        }
    }
}
