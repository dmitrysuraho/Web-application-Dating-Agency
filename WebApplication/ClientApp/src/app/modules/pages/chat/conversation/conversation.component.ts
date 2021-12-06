import {
    Component,
    ElementRef,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat, Message } from '../chat.types';
import { ChatService } from '../chat.service';
import { User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";
import { FuseSplashScreenService } from "../../../../../@fuse/services/splash-screen";

@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html'
})
export class ConversationComponent implements OnInit, OnDestroy
{
    @Input()
    isGettingChat: boolean;

    @Input()
    user: User;

    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    sendForm: FormGroup;
    message: Message;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _chatService: ChatService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _ngZone: NgZone,
        private _userService: UserService,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _route: Router,
        private _splashScreen: FuseSplashScreenService,
        private _translateService: TranslateService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get lang
     */
    get getLang(): string {
        return this._translateService.currentLang === 'ru' ? 'ru-BY' : 'en-GB';
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
        // Create the form
        this.sendForm = this._formBuilder.group({
            send: ['']
        });

        // Get chat and read all messages
        this._activatedRoute.queryParamMap
            .pipe(
                switchMap((params: ParamMap) => {
                    this.isGettingChat = true;
                    return this._chatService.getChatById(params.get('id'));
                }),
                switchMap((chat: Chat) => {
                    this.chat = chat;
                    return this._chatService.readMessages(chat.chatId);
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((chat: Chat) => {
                this.isGettingChat = false;
            });

        // Subscribe to receive message
        this._chatService.receiveMessage()
            .pipe(
                switchMap((message: Message) => {
                    message.isMine = message.userId === this.user.userId;
                    if (this.chat && this.chat.chatId === message.chatId) {
                        if (this.chat.unreadCount) this.chat.unreadCount++;
                        this.chat.messages.push(message);
                        return this._chatService.readMessages(this.chat.chatId);
                    }
                    return of();
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
     * Reset the chat
     */
    resetChat(): void
    {
        // Reset the chat
        this._chatService.resetChat();

        this.chat = null;

        // Navigate to chat
        this._route.navigateByUrl('chat');
    }

    /**
     * Send message
     *
     * @param event
     */
    send(event: Event): void {
        // Don't process enter event
        if (event) {
            event.preventDefault();
        }

        // Get control value
        const value: string = this.sendForm.get('send').value;

        // Check input if empty
        if(value && value.trim()) {
            // Create message
            this.message = {
                messageText: value,
                chatId: this.chat.chatId,
                userId: this.user.userId,
                createdAt: Date.now().toString()
            };

            // Send message
            this._chatService.sendMessage(this.message, this.chat.member.userId);
        }

        // Reset form
        this.sendForm.reset();

        // Resize form
        this._resizeMessageInput();
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
