import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from "@ngx-translate/core";
import { Observable, of, Subject } from "rxjs";
import { catchError, takeUntil, tap } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TwitterAuthProvider, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;

@Injectable()
export class AuthService implements OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _angularFireAuth: AngularFireAuth,
        private _translateService: TranslateService
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
            .then(() => localStorage.removeItem('accessToken'));
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
                this._httpClient.post('api/users', {
                    uid: result.user.uid,
                    sex: user.sex,
                    name: user.name,
                    birthday: user.birthday,
                    region: user.region
                })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(() => result.user.sendEmailVerification());
            });
    }

    /**
     * Sign in with Google
     */
    googleSignIn(): Promise<any> {
        return this._selectProvider(new GoogleAuthProvider());
    }

    /**
     * Sign in with Twitter
     */
    twitterSignIn(): Promise<any> {
        return this._selectProvider(new TwitterAuthProvider());
    }

    /**
     * Sign in with Github
     */
    githubSignIn(): Promise<any> {
        return this._selectProvider(new GithubAuthProvider());
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
                    if (user) this.accessToken = await user.getIdToken(true);
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
                    name: user.displayName
                })
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        catchError(() => this.accessToken = '')
                    )
                    .subscribe();
                this.accessToken = result.user.multiFactor.user.accessToken;
            });
    }
}
