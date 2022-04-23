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

        public object[] GetNews(int currentId)
        {
            int[] favorites = _context.Users
                .Where(prop => _context.Datings.FirstOrDefault(p => p.UserId == currentId && prop.UserId == p.Candidate && p.IsFavorite == true) != null)
                .Select(prop => prop.UserId)
                .ToArray();
            return _context.Posts.Where(prop => favorites.Contains(prop.UserId))
                .OrderByDescending(prop => prop.PostId)
                .Select(prop => new
                {
                    postId = prop.PostId,
                    description = prop.Description,
                    image = prop.Image,
                    likesCount = _context.Likes.Count(p => p.PostId == prop.PostId),
                    commentsCount = _context.Comments.Count(p => p.PostId == prop.PostId),
                    isLike = _context.Likes.FirstOrDefault(p => p.UserId == currentId && p.PostId == prop.PostId) != null,
                    comments = _context.Comments.Where(p => p.PostId == prop.PostId)
                                .OrderByDescending(o => o.CommentId)
                                .Select(c => new
                                {
                                    commentId = c.CommentId,
                                    commentText = c.CommentText,
                                    postId = c.PostId,
                                    userId = c.UserId,
                                    sender = new
                                    {
                                        userId = _context.Users.FirstOrDefault(u => u.UserId == c.UserId).UserId,
                                        name = _context.Users.FirstOrDefault(u => u.UserId == c.UserId).Name,
                                        photo = _context.Users.FirstOrDefault(u => u.UserId == c.UserId).Photo
                                    }
                                })
                                .ToArray(),
                    owner = new
                    {
                        userId = _context.Users.FirstOrDefault(u => u.UserId == prop.UserId).UserId,
                        name = _context.Users.FirstOrDefault(u => u.UserId == prop.UserId).Name,
                        photo = _context.Users.FirstOrDefault(u => u.UserId == prop.UserId).Photo,
                        isCurrentUser = false
                    }
                }).ToArray();

        }

        public object[] GetPostsByUserId(int currentId, int id)
        {
            return _context.Posts
                .Where(prop => prop.UserId == id)
                .OrderByDescending(prop => prop.PostId)
                .Select(prop => new
                {
                    postId = prop.PostId,
                    description = prop.Description,
                    image = prop.Image,
                    likesCount = _context.Likes.Count(p => p.PostId == prop.PostId),
                    commentsCount = _context.Comments.Count(p => p.PostId == prop.PostId),
                    isLike = _context.Likes.FirstOrDefault(p => p.UserId == currentId && p.PostId == prop.PostId) != null,
                    comments = _context.Comments.Where(p => p.PostId == prop.PostId)
                                .OrderByDescending(o => o.CommentId)
                                .Select(c => new
                                {
                                    commentId = c.CommentId,
                                    commentText = c.CommentText,
                                    postId = c.PostId,
                                    userId = c.UserId,
                                    sender = new
                                    {
                                        userId = _context.Users.FirstOrDefault(u => u.UserId == c.UserId).UserId,
                                        name = _context.Users.FirstOrDefault(u => u.UserId == c.UserId).Name,
                                        photo = _context.Users.FirstOrDefault(u => u.UserId == c.UserId).Photo
                                    }
                                })
                                .ToArray()
                }).ToArray();
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
                image = post.Image,
                likesCount = 0,
                commentsCount = 0,
                isLike = false,
                comments = new object[] {}
            };
        }

        public void DeletePost(int id)
        {
            _context.Posts.Remove(_context.Posts.Find(id));
            _context.SaveChanges();
        }

        public void Like(int userId, int postId)
        {
            Like foundLike = _context.Likes.FirstOrDefault(prop => prop.UserId == userId && prop.PostId == postId);
            if (foundLike == null)
            {
                _context.Likes.Add(new Like
                {
                    UserId = userId,
                    PostId = postId
                });
                _context.SaveChanges();
            }
            else
            {
                _context.Remove(foundLike);
                _context.SaveChanges();
            }
        }

        public void Unlike(int userId, int postId)
        {
            Like foundLike = _context.Likes.FirstOrDefault(prop => prop.UserId == userId && prop.PostId == postId);
            _context.Remove(foundLike);
            _context.SaveChanges();
        }

        public Comment AddComment(Comment comment)
        {
            _context.Comments.Add(comment);
            _context.SaveChanges();
            return comment;
        }

        public void DeleteComment(int id)
        {
            Comment foundComment = _context.Comments.Find(id);
            _context.Comments.Remove(foundComment);
            _context.SaveChanges();
        }
    }
}
