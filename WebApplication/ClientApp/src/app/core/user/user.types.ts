export interface User
{
    id: string;
    sex?: string;
    name: string;
    birthday: Date;
    region?: string;
    photo?: string;
    about?: string;
    email?: string;
    phone?: string;
    isCurrentUser?: boolean;
    isBlocked?: boolean;
}
