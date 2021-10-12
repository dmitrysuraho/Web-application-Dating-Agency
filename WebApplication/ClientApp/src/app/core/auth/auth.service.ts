import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { UserService } from 'app/core/user/user.service';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { TwitterAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import firebase from "firebase/compat";
import User = firebase.User;
import UserCredential = firebase.auth.UserCredential;

@Injectable()
export class AuthService
{

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _angularFireAuth: AngularFireAuth
    )
    {
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
            .then((result) => {
                const user: User = result.user;
                if (!user.emailVerified) {
                    this._angularFireAuth.signOut();
                    throw new Error('Please, verify your email.')
                }
            });
    }

    /**
     * Sign out
     */
    signOut(): Promise<any>
    {
        return this._angularFireAuth.signOut();
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; }): Promise<any>
    {
        return this._angularFireAuth.createUserWithEmailAndPassword(user.email, user.password)
            .then((result: UserCredential) => {result.user.sendEmailVerification()});
    }

    /**
     * Sign in with Twitter
     */
    twitterSignIn(): Promise<any> {
        return this._angularFireAuth.signInWithRedirect(new TwitterAuthProvider());
    }

    /**
     * Sign in with Github
     */
    githubSignIn(): Promise<any> {
        return this._angularFireAuth.signInWithRedirect(new GithubAuthProvider());
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if user is sign in and email verification
        return this._angularFireAuth.authState
            .pipe(
                map(
                    (user: User) =>
                        user &&
                        (user.emailVerified || user.providerData[0].providerId !== 'password')
                )
            );
    }
}
