import { Injectable } from '@angular/core';
import { assign, cloneDeep, omit } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { chats as chatsData } from 'app/mock-api/apps/chat/data';

@Injectable({
    providedIn: 'root'
})
export class ChatMockApi
{
    private _chats: any[] = chatsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Chats - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/chats')
            .reply(() => {

                // Clone the chats
                const chats = cloneDeep(this._chats);

                // Return the response
                return [200, chats];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Chat - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/chat/chat')
            .reply(({request}) => {

                // Get the chat id
                const id = request.params.get('id');

                // Clone the chats
                const chats = cloneDeep(this._chats);

                // Find the chat we need
                const chat = chats.find(item => item.chatId == id);

                // Return the response
                return [200, chat];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Chat - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/chat/chat')
            .reply(({request}) => {

                // Get the id and chat
                const id = request.body.id;
                const chat = cloneDeep(request.body.chat);

                // Prepare the updated chat
                let updatedChat = null;

                // Find the chat and update it
                this._chats.forEach((item, index, chats) => {

                    if ( item.chatId == id )
                    {
                        // Update the chat
                        chats[index] = assign({}, chats[index], chat);

                        // Store the updated chat
                        updatedChat = chats[index];
                    }
                });

                // Return the response
                return [200, updatedChat];
            });
    }
}
