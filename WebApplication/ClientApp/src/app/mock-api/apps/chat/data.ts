/* eslint-disable */
import * as moment from 'moment';

/**
 * Attachments are common and will be filled from here
 * to keep the demo data maintainable.
 */

/**
 *  If a message belongs to our user, it's marked by setting it as
 *  'me'. If it belongs to the user we are chatting with, then it
 *  left empty. We will be using this same conversation for each chat
 *  to keep things more maintainable for the demo.
 */
export const chats = [
    {
        chatId           : 1,
        member      : {
            userId: '1',
            name: 'Дмитрий Сураго',
            photo: ''
        },
        unreadCount  : 0,
        muted        : false,
        lastMessage  : 'See you tomorrow!',
        lastMessageAt: '26/04/2021',
        messages: []
    },
    {
        chatId           : 2,
        member      : {
            userId: '2',
            name: 'Dmitry Suraho',
            photo: ''
        },
        unreadCount  : 0,
        muted        : false,
        lastMessage  : 'See you tomorrow!',
        lastMessageAt: '26/04/2021',
        messages: []
    }
];
