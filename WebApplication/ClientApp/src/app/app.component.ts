import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "./core/auth/auth.service";
import { takeUntil } from "rxjs/operators";
import { forkJoin, Subject } from "rxjs";
import { User } from "./core/user/user.types";
import { UserService } from "./core/user/user.service";
import { Navigation } from "./core/navigation/navigation.types";
import { NavigationService } from "./core/navigation/navigation.service";
import { CalendarService } from "./modules/pages/calendar/calendar.service";
import moment from "moment";
import { Chat, Message } from "./modules/pages/chat/chat.types";
import { ChatService } from "./modules/pages/chat/chat.service";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService,
        private _authService: AuthService,
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _calendarService: CalendarService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
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
        // Set interval to refresh token
        this._authService.refreshToken()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
        setInterval(() =>
            this._authService.refreshToken()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(), 3500 * 1000);

        // Set default language
        if (localStorage.getItem('lang')) {
            this._translateService.use(localStorage.getItem('lang'));
        } else {
            this._translateService.use('ru');
        }

        // Set default dating settings
        this._userService.user$
            .subscribe((user: User) => {
                // Set sex
                if (!localStorage.getItem('sex')) {
                    localStorage.setItem('sex', 'All');
                }

                // Set age
                if (!localStorage.getItem('age')) {
                    localStorage.setItem('age', '18-30');
                }
            });

        const interval = setInterval(() => {
            if (this._authService.accessToken) {
                this._setNavigationSubtitles();
                clearInterval(interval);
            }
        }, 100);

        this._chatService.receiveMessage()
            .pipe()
            .subscribe(([message, user, chat]: [Message, User, Chat]) => {
                if (!this._route.url.includes('chat') && !message.isMine) {
                    this._setNavigationSubtitles();
                }
            })
    }

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
