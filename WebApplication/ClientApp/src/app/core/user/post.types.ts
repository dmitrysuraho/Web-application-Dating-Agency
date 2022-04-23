import { User } from "./user.types";

export interface Post {
    postId?: string;
    description?: string;
    image?: string;
    likesCount?: number;
    commentsCount?: number;
    isLike?: boolean;
    comments?: Comment[];
    owner?: User;
}

export interface Comment {
    commentId?: string;
    commentText?: string;
    postId?: string;
    userId?: string;
    sender?: User;
}
