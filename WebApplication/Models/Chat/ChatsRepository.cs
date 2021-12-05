using System;
using System.Linq;

namespace WebApplication.Models
{
    public class ChatsRepository
    {
        private readonly ApplicationContext _context;

        public ChatsRepository(ApplicationContext context)
        {
            _context = context;
        }

        public Chat CreateOrGetChat(int currentId, int id)
        {
            Chat chat =_context.Chats.FirstOrDefault(prop =>
                _context.Members.FirstOrDefault(p => p.UserId == currentId && p.ChatId == prop.ChatId).ChatId ==
                _context.Members.FirstOrDefault(p => p.UserId == id && p.ChatId == prop.ChatId).ChatId
            );
            if (chat == null)
            {
                Chat newChat = new Chat { UserId = currentId };
                _context.Chats.Add(newChat);
                _context.Members.AddRange(
                    new Member { UserId = currentId, Chat = newChat },
                    new Member { UserId = id, Chat = newChat }
                );
                _context.SaveChanges();
                return newChat;
            }
            return chat;
        }

        public object[] GetChats(int currentId)
        {
            return _context.Chats.Where(prop =>
                    _context.Members.FirstOrDefault(p => p.UserId == currentId && p.ChatId == prop.ChatId) != null //&&
                    //_context.Messages.FirstOrDefault(p => p.ChatId == prop.ChatId) != null &&
                    //_context.Chats.FirstOrDefault(p => p.UserId == currentId && p.ChatId == prop.ChatId) != null
                )
                .Select(prop => new
                {
                    chatId = prop.ChatId,
                    member = _context.Users.FirstOrDefault(p => _context.Members.FirstOrDefault(m => m.UserId == p.UserId && m.UserId != currentId && m.ChatId == prop.ChatId) != null),
                    lastMessage = _context.Messages.OrderByDescending(p => p.CreatedAt).FirstOrDefault(p => p.ChatId == prop.ChatId),
                    messages = _context.Messages.Where(p => p.ChatId == prop.ChatId)
                                    .Select(prop => new
                                    {
                                        messageId = prop.MessageId,
                                        messageText = prop.MessageText,
                                        chatId = prop.ChatId,
                                        userId = prop.UserId,
                                        isMine = prop.UserId == currentId,
                                        createdAt = prop.CreatedAt
                                    }).ToArray(),
                    unreadCount = _context.Messages.Count(p => p.UserId != currentId && p.ChatId == prop.ChatId && _context.Statuses.FirstOrDefault(s => s.MessageId == p.MessageId) != null)
                })
                .ToArray();
        }

        public object GetChat(int currentId, int chatId)
        {
            Chat chat = _context.Chats.FirstOrDefault(prop => prop.ChatId == chatId);
            if (chat == null) return null;
            return new
            {
                chatId = chatId,
                member = _context.Users.FirstOrDefault(p => _context.Members.FirstOrDefault(m => m.UserId == p.UserId && m.UserId != currentId && m.ChatId == chatId) != null),
                messages = GetMessages(currentId, chatId),
                lastMessage = _context.Messages.OrderByDescending(p => p.CreatedAt).FirstOrDefault(p => p.ChatId == chat.ChatId),
                unreadCount = _context.Messages.Count(p => p.UserId != currentId && p.ChatId == chat.ChatId && _context.Statuses.FirstOrDefault(s => s.MessageId == p.MessageId) != null)
            };
        }

        public object[] GetMessages(int currentId, int chatId)
        {
            return _context.Messages.Where(p => p.ChatId == chatId)
                                    .Select(prop => new
                                    {
                                        messageId = prop.MessageId,
                                        messageText = prop.MessageText,
                                        chatId = prop.ChatId,
                                        userId = prop.UserId,
                                        isMine = prop.UserId == currentId,
                                        createdAt = prop.CreatedAt
                                    }).ToArray();
        }

        public bool IsChatCreator(int userId, int chatId)
        {
            return _context.Chats.FirstOrDefault(prop => prop.UserId == userId && prop.ChatId == chatId) != null;
        }
    }
}
