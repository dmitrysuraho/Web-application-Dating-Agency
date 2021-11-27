import { Post } from "./post.types";

export interface User
{
    userId: string;
    sex?: string;
    name: string;
    birthday?: Date;
    region?: string;
    photo?: string;
    about?: string;
    email?: string;
    phone?: string;
    gallery?: string[];
    posts?: Post[];
    isCurrentUser?: boolean;
    isBlocked?: boolean;
    isYouBlocked?: boolean;
}
