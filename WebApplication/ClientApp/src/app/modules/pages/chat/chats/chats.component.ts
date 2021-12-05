import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Chat, Message } from '../chat.types';
import { ChatService } from '../chat.service';
import { User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";

@Component({
    selector       : 'chat-chats',
    templateUrl    : './chats.component.html'
})
export class ChatsComponent implements OnInit, OnDestroy
{
    chats: Chat[];
    filteredChats: Chat[];
    unreadCount: number;
    user: User;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _userService: UserService,
        private _activatedRoute: ActivatedRoute,
        private _route: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get and select chat
        this._chatService.chats$
            .pipe(
                switchMap((chats: Chat[]) => {
                    if (chats) {
                        this.chats = chats;
                        this.filteredChats = chats;
                        return this._activatedRoute.queryParamMap
                            .pipe(
                                switchMap((params: ParamMap) => {
                                    if (params.get('id')) {
                                        const chat: Chat = chats.find((chat: Chat) => chat.chatId == params.get('id'));
                                        if (!chat) {
                                            this._route.navigateByUrl('not-found');
                                            return of(null);
                                        }
                                        else {
                                            this.selectChat(chat);
                                            return of(chat);
                                        }
                                    }
                                    return of(null);
                                })
                            )
                    }
                    return of(null);
                })
            )
            .subscribe();

        // Current user
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Reset chat
        this._chatService.resetChat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.selectedChat = null;
            });

        // Receive message
        this._chatService.receiveMessage()
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((message: Message) => {
                this.chats = this.chats.map((chat: Chat) => {
                   if (chat.chatId == message.chatId) {
                       chat.lastMessage = message;
                   }
                   return chat;
                });
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select chat
     *
     * @param chat
     */
    selectChat(chat: Chat): void {
        // Select chat
        this.selectedChat = chat;

        // Set count of unread messages
        this.unreadCount = chat.unreadCount;

        if (chat.unreadCount > 0) {
            // Read all messages
            this._chatService.readMessages(chat.chatId)
                .pipe(
                    takeUntil(this._unsubscribeAll)
                )
                .subscribe(() => chat.unreadCount = 0);
        }
    }

    /**
     * Filter the chats
     *
     * @param query
     */
    filterChats(query: string): void
    {
        // Reset the filter
        if (!query)
        {
            this.filteredChats = this.chats;
            return;
        }

        this.filteredChats = this.chats.filter(chat => chat.member.name.toLowerCase().includes(query.toLowerCase()));
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
