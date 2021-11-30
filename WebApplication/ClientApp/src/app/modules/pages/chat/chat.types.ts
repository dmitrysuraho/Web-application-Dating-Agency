import { User } from "../../../core/user/user.types";

export interface Chat
{
    chatId: string;
    member?: User;
    messages?: Message[];
}

export interface Message
{
    messageId?: string;
    messageText?: string;
    chatId?: string;
    userId?: string;
    isMine?: boolean;
    createdAt?: string;
}
