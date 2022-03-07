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
import { AngularFireStorageReference } from "@angular/fire/compat/storage";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Chat, Message } from '../chat.types';
import { ChatService } from '../chat.service';
import { User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";
import { FuseSplashScreenService } from "../../../../../@fuse/services/splash-screen";
import { UploadService } from "../../../../core/upload/upload.service";
import { AttachmentsDialogComponent } from "../attachments-dialog/attachments-dialog.component";
import { CalendarService } from "../../calendar/calendar.service";
import { NavigationService } from "../../../../core/navigation/navigation.service";

@Component({
    selector       : 'chat-conversation',
    templateUrl    : './conversation.component.html'
})
export class ConversationComponent implements OnInit, OnDestroy
{
    @Input()
    user: User;

    @ViewChild('messageInput') messageInput: ElementRef;
    chat: Chat;
    sendForm: FormGroup;
    message: Message;
    isGettingChat: boolean;
    isSending: boolean;
    srcFile: string;
    image: any;
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
        private _translateService: TranslateService,
        private _upload: UploadService,
        private _dialog: MatDialog,
        private _calendarService: CalendarService,
        private _navigationService: NavigationService
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
            .subscribe(() => {
                this.isGettingChat = false;
            });

        // Subscribe to receive message
        this._chatService.receiveMessage()
            .pipe(
                switchMap(([message, user, chat]: [Message, User, Chat]) => {
                    message.isMine = message.userId === this.user.userId;
                    if (this.chat && this.chat.chatId === message.chatId) {
                        if (this.chat.unreadCount) this.chat.unreadCount++;
                        if (message.userId == this.user.userId) {
                            this.isSending = false;
                            this.sendForm.enable();
                        }
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
     * Add image
     */
    addImage(): void {
        const inputNode: any = document.querySelector('#postImage');

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.srcFile = event.target.result;
            };

            const file: any = inputNode.files[0];

            if (file) {
                reader.readAsDataURL(file);
                this.image = file;
            }
        }
    }

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
        if((value && value.trim()) || this.image) {
            // Set sending
            this.isSending = true;

            // Disable form
            this.sendForm.disable();

            // Create message
            this.message = {
                messageText: value,
                chatId: this.chat.chatId,
                userId: this.user.userId,
                createdAt: Date.now().toString()
            };

            // Sender
            const user: User = !this.chat.messages.length ?
                                {
                                    userId: this.user.userId,
                                    name: this.user.name,
                                    photo: this.user.photo
                                } : null;

            const chat: Chat = !this.chat.messages.length ? this.chat : null;

            // Send message
            if (this.srcFile) {
                this._upload.uploadMessage(this.message, this.image, this.chat.member.userId, user, chat, this.chat)
                    .then((reference: Observable<AngularFireStorageReference>) => {
                        reference
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe();
                    });
            } else {
                this._chatService.sendMessage(this.message, this.chat.member.userId, user, chat);
            }
        }

        // Reset form
        this.sendForm.reset();

        // Clear image section
        this.deleteImage();

        // Resize form
        this._resizeMessageInput();
    }

    /**
     * Delete image
     */
    deleteImage(): void {
        this.srcFile = null;
        this.image = null;
    }

    /**
     * Show attachments
     */
    _showAttachments(): void {
        this._upload.getChatAttachments('images/chats/' + this.chat.chatId)
            .subscribe((images: string[]) => {
                this._dialog.open(AttachmentsDialogComponent, {
                    data: { images: images }
                });
            });
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
