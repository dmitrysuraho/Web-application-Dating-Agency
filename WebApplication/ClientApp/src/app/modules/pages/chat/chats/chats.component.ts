import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chat } from '../chat.types';
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
    drawerOpened: boolean = false;
    filteredChats: Chat[];
    user: User;
    selectedChat: Chat;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _userService: UserService
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
        // Chats
        this._chatService.chats$
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((chats: Chat[]) => {
                this.chats = chats;
                this.filteredChats = chats;
            });

        // Current user
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Selected chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.selectedChat = chat;
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
