import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
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
    @Input()
    chats: Chat[];

    @Input()
    filteredChats: Chat[];

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
        // If selected chat
        this._chatService.chats$
            .pipe(
                switchMap((chats: Chat[]) =>
                    this._activatedRoute.queryParamMap
                        .pipe(
                            tap((params: ParamMap) => {
                                if (params.get('id') && chats) {
                                    this.selectChat(chats.find((chat: Chat) => chat.chatId == params.get('id')));
                                }
                            })
                        )),
                takeUntil(this._unsubscribeAll)
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
                switchMap(([message, user, chat]: [Message, User, Chat]) => {
                    if (user && chat) {
                        if (user.userId == this.user.userId) {
                            chat.lastMessage = message;
                            if (message.userId != this.user.userId && (!this.selectedChat || message.chatId != this.selectedChat.chatId)) {
                                chat.unreadCount = 1;
                            }
                            this.chats.unshift(chat);
                            return this._chatService.setChat(chat);
                        } else {
                            const newChat: Chat = {
                                chatId: message.chatId,
                                member: user,
                                lastMessage: message,
                                unreadCount: (!this.selectedChat || message.chatId != this.selectedChat.chatId) ? 1 : 0
                            }
                            this.chats.unshift(newChat);
                            return this._chatService.setChat(newChat);
                        }
                    } else {
                        this.chats = this.chats.map((chat: Chat) => {
                            if (chat.chatId == message.chatId) {
                                chat.lastMessage = message;
                            }
                            if (chat.chatId != this.selectedChat?.chatId &&
                                chat.chatId == message.chatId &&
                                message.userId != this.user.userId) {
                                chat.unreadCount++;
                            }
                            return chat;
                        }).sort(function(a,b) {
                            if (a.lastMessage.createdAt > b.lastMessage.createdAt) {
                                return -1;
                            }
                            if (a.lastMessage.createdAt < b.lastMessage.createdAt) {
                                return 1;
                            }
                            return 0;
                        });
                        this.filteredChats = this.chats;
                        return of();
                    }
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe();
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

        // Read all messages
        if (chat) this.selectedChat.unreadCount = 0;
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
