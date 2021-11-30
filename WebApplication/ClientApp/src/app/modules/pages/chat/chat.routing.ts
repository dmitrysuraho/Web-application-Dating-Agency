import { Route } from '@angular/router';
import { ChatChatResolver, ChatChatsResolver } from './chat.resolvers';
import { ChatComponent } from './chat.component';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';

export const chatRoutes: Route[] = [
    {
        path     : '',
        component: ChatComponent,
        resolve  : {
            chats   : ChatChatsResolver
        },
        children : [
            {
                path     : '',
                component: ChatsComponent,
                children : [
                    {
                        path     : '',
                        component: ConversationComponent,
                        children : [
                            {
                                path   : ':id',
                                resolve: {
                                    conversation: ChatChatResolver
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
