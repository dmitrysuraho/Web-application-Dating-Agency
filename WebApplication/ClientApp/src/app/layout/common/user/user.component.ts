import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { CallService } from 'app/modules/pages/chat/call.service';
import { ChatService } from 'app/modules/pages/chat/chat.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Chat, Message } from 'app/modules/pages/chat/chat.types';
import { CalendarService } from 'app/modules/pages/calendar/calendar.service';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { CallDialogComponent } from 'app/modules/pages/chat/call-dialog/call-dialog.component';
import moment from 'moment';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _callService: CallService,
        private _chatService: ChatService,
        private _calendarService: CalendarService,
        private _translateService: TranslateService,
        private _navigationService: NavigationService,
        private _route: Router,
        private _dialog: MatDialog
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
        // Set sex
        if (!localStorage.getItem('sex')) {
            localStorage.setItem('sex', 'All');
        }

        // Set age
        if (!localStorage.getItem('age')) {
            localStorage.setItem('age', '18-30');
        }

        // Set interest
        if (!localStorage.getItem('interest')) {
            localStorage.setItem('interest', '');
        }

        // Set region
        if (!localStorage.getItem('region')) {
            localStorage.setItem('region', '');
        }

        this._setNavigationSubtitles();

        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._chatService.receiveMessage()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([message, user, chat]: [Message, User, Chat]) => {
                if (!this._route.url.includes('chat') && !message.isMine) {
                    this._setNavigationSubtitles();
                }
            });

        this._callService.receiveCall()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([peerId, user]: [string, User]) => {
                if (peerId && peerId !== 'video-on' && peerId !== 'video-off') {
                    this._dialog.open(CallDialogComponent, {
                        maxWidth: '100vw',
                        disableClose: true,
                        data: { userId: user.userId, user: user, joinCall: true, peerId: peerId, member: user }
                    });
                }
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
     * Navigate
     */
    navigate(url: string): void
    {
        this._router.navigate([url]);
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set calendar subtitle
     *
     * @private
     */
    private _setNavigationSubtitles(): void {
        forkJoin(
            this._calendarService.getEventsForNav(moment(), moment()),
            this._chatService.getChats()
        )
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([events, chats]) => {
                this._navigationService.get()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((navigation: Navigation) => {
                        let countEvents = 0;
                        let countMessages = 0;
                        const defaultCalendar = navigation.default.find(item => item.id == 'calendar');
                        const horizontalCalendar = navigation.horizontal.find(item => item.id == 'calendar');
                        const defaultChat = navigation.default.find(item => item.id == 'chat');
                        const horizontalChat = navigation.horizontal.find(item => item.id == 'chat');
                        events.map(event => {
                            const now = new Date();
                            const start = new Date(event.start);
                            const diffDate = start.getDate() - now.getDate();
                            const diffMonth = start.getMonth() - now.getMonth();
                            if ((start > now) && (diffDate > 0 && diffDate <= 7 && diffMonth === 0)) {
                                countEvents++;
                            }
                            return event;
                        });
                        chats.map((chat: Chat) => {
                            if (chat?.unreadCount) {
                                countMessages++;
                            }
                            return chat;
                        });
                        defaultCalendar.subtitle = this._translateService.instant('calendar.upcoming-events', { count: countEvents });
                        horizontalCalendar.badge = {
                            title  : countEvents.toString(),
                            classes: 'ml-2 px-2 bg-pink-600 text-white rounded-full'
                        };
                        if (countMessages) {
                            defaultChat.badge = horizontalChat.badge = {
                                title  : countMessages.toString(),
                                classes: 'ml-2 px-2 bg-pink-600 text-white rounded-full'
                            };
                        }
                    });
            });
    }
}
