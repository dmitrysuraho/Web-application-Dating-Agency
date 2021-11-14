export interface User
{
    userId: string;
    sex?: string;
    name: string;
    birthday: Date;
    region?: string;
    photo?: string;
    about?: string;
    email?: string;
    phone?: string;
    gallery?: string[];
    isCurrentUser?: boolean;
    isBlocked?: boolean;
    isYouBlocked?: boolean;
}
