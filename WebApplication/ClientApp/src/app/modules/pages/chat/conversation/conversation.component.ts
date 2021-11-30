import {
    Component,
    ElementRef,
    HostListener,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat, Message } from '../chat.types';
import { ChatService } from '../chat.service';
import { User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";

@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html'
})
export class ConversationComponent implements OnInit, OnDestroy
{
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    user: User;
    message: Message = { messageText: '' };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resize on 'input' and 'ngModelChange' events
     *
     * @private
     */
    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void
    {
        // This doesn't need to trigger Angular's change detection by itself
        this._ngZone.runOutsideAngular(() => {

            setTimeout(() => {

                // Set the height to 'auto' so we can correctly read the scrollHeight
                this.messageInput.nativeElement.style.height = 'auto';

                // Get the scrollHeight and subtract the vertical padding
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
            });
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Chat
        this._chatService.chat$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((chat: Chat) => {
                this.chat = chat;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Set the drawerMode if the given breakpoint is active
                 this.drawerMode = matchingAliases.includes('lg') ? 'side' : 'over';
            });

        // Current user
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // Subscribe to receive message
        this._chatService.receiveMessage()
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe( (receivedMessage: Message) => {
                receivedMessage.isMine = receivedMessage.userId === this.user.userId;
                if (this.chat && this.chat.chatId === receivedMessage.chatId) this.chat.messages.push(receivedMessage);
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
     * Reset the chat
     */
    resetChat(): void
    {
        // Reset the chat
        this._chatService.resetChat();

        // Close the contact info in case it's opened
        this.drawerOpened = false;
    }

    /**
     * Send message
     */
    send(): void {
        if(this.message.messageText) {
            // Create message
            this.message = {
                messageText: this.message.messageText,
                chatId: this.chat.chatId,
                userId: this.user.userId,
                createdAt: Date.now().toString()
            };

            // Send message
            this._chatService.sendMessage(this.message, this.chat.member.userId);
            this.message = { messageText: '' };
        }
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
