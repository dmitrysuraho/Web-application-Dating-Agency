import { User } from "../../../core/user/user.types";

export interface Chat
{
    chatId: string;
    member?: User;
    messages?: Message[];
    lastMessage?: Message;
    unreadCount?: number;
}

export interface Message
{
    messageId?: string;
    messageText?: string;
    messageImage?: string;
    chatId?: string;
    userId?: string;
    isMine?: boolean;
    createdAt?: string;
}
