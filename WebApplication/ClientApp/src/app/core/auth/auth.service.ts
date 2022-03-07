import { Injectable, Injector, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, Observable, of, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { TwitterAuthProvider, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;
import moment from "moment";
import { Navigation } from "../navigation/navigation.types";
import { CalendarService } from "../../modules/pages/calendar/calendar.service";
import { NavigationService } from "../navigation/navigation.service";
import { Chat } from "../../modules/pages/chat/chat.types";
import { ChatService } from "../../modules/pages/chat/chat.service";

@Injectable()
export class AuthService implements OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _injector: Injector,
        private _httpClient: HttpClient,
        private _angularFireAuth: AngularFireAuth,
        private _translateService: TranslateService,
        private _router: Router,
        private _calendarService: CalendarService,
        private _navigationService: NavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Promise<any>
    {
        return this._angularFireAuth.sendPasswordResetEmail(email);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Promise<any>
    {
        return this._angularFireAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
            .then((result: any) => {
                const user: User = result.user;
                if (!user.emailVerified) {
                    this.signOut();
                    throw new Error(this._translateService.instant('common.alert.verify-email'));
                }
                this.accessToken = result.user.multiFactor.user.accessToken;
            });
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._angularFireAuth.signOut()
            .then(() => {
                localStorage.clear();

                const interval = setInterval(() => {
                    if (this.accessToken) {
                        this._setNavigationSubtitles();
                        clearInterval(interval);
                    }
                }, 100);
            });
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: any): Promise<any>
    {
        return this._angularFireAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result: UserCredential) => {
                return this._httpClient.post('api/users', {
                    uid: result.user.uid,
                    sex: user.sex,
                    name: user.name,
                    birthday: user.birthday,
                    region: user.region,
                    email: user.email
                })
                    .pipe(
                        catchError(() => {
                            // Delete firebase user
                            result.user.delete();
                            throw new Error();
                        }),
                        takeUntil(this._unsubscribeAll),
                        tap(() => {
                            // Sent email verification
                            result.user.sendEmailVerification();

                            // Navigate to the confirmation required page
                            this._router.navigateByUrl('/confirmation-required');
                        })
                    );
            });
    }

    /**
     * Sign in with Google
     */
    googleSignIn(): void {
        this._selectProvider(new GoogleAuthProvider());
    }

    /**
     * Sign in with Twitter
     */
    twitterSignIn(): void {
        this._selectProvider(new TwitterAuthProvider());
    }

    /**
     * Sign in with Github
     */
    githubSignIn(): void {
        this._selectProvider(new GithubAuthProvider());
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if user is sign in
        if (this.accessToken) return of(true);
        else return of(false);
    }

    /**
     * Refresh token
     */
    refreshToken(): Observable<User> {
        return this._angularFireAuth.authState
            .pipe(
                tap(async (user: User) => {
                    if (user && this.accessToken) this.accessToken = await user.getIdToken(true);
                })
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Select provider for sign in
     *
     * @param provider
     */
    private _selectProvider(provider: any): Promise<any> {
        return this._angularFireAuth.signInWithPopup(provider)
            .then((result: any) => {
                const user: User = result.user;
                this._httpClient.post('api/users', {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    phone: user.phoneNumber
                })
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        catchError(() => this.accessToken = '')
                    )
                    .subscribe(() => {
                        this.accessToken = result.user.multiFactor.user.accessToken;
                        this._router.navigateByUrl('');
                    });
            });
    }

    /**
     * Set calendar subtitle
     *
     * @private
     */
    private _setNavigationSubtitles(): void {
        forkJoin(
            this._calendarService.getEventsForNav(moment(), moment()),
            this._injector.get(ChatService).getChats()
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
