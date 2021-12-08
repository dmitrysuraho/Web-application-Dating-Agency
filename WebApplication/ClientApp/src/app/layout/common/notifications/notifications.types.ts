export interface Notice
{
    noticeId?: string;
    sender: string;
    action: string;
    isRead: boolean;
    time: string;
    title?: string;
    description?: string;
    icon?: string;
    link?: string;
}
