import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable, ReplaySubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { Notification } from 'app/core/user/notification.types';
import { Dating } from './dating.types';
import { Post, Comment } from "./post.types";
import { Subscription } from "./subscription.types";

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _angularFireAuth: AngularFireAuth
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get current user
     */
    getCurrentUser(): Observable<User> {
        return this._httpClient.get<User>('api/users')
            .pipe(
                tap((user: User) => this._user.next(user))
            );
    }

    /**
     * Is user disabled
     *
     * @param id
     */
    isUserDisabled(id: string): Observable<boolean> {
        return this._httpClient.get<boolean>(`api/users/${id}/blocking`);
    }

    /**
     * Get user by id
     *
     * @param id
     */
    getUserById(id: string): Observable<User>
    {
        return this._httpClient.get<User>('api/users/' + id);
    }

    /**
     * Update current user
     *
     * @param user
     */
    updateCurrentUser(user: User): Observable<User>
    {
        return this._httpClient.put<User>('api/users', user);
    }

    /**
     * Get subscription
     */
    getSubscription(): Observable<Subscription> {
        return this._httpClient.get<Subscription>('api/users/subscription');
    }

    /**
     * Buy subscription
     *
     * @param end
     */
    buySubscription(end: Date): Observable<Subscription> {
        return this._httpClient.put<Subscription>('api/users/subscription', { end: end });
    }

    /**
     * Update gallery
     *
     * @param image
     */
    addToGallery(image: string): Observable<any>
    {
        return this._httpClient.post('api/gallery', { image: image });
    }

    /**
     * Delete image from gallery
     *
     * @param image
     */
    deleteFromGallery(image: string): Observable<any> {
        const query: string = image.split('?')[0].split('%2F').pop();
        return this._httpClient.delete('api/gallery?image=' + query);
    }

    /**
     * Change password
     *
     * @param newPassword
     */
    changePassword(newPassword: string): Observable<any> {
        return this._angularFireAuth.authState
            .pipe(
                switchMap((user) => user.updatePassword(newPassword))
            );
    }

    /**
     * Get notifications
     */
    getNotifications(): Observable<Notification> {
        return this._httpClient.get<Notification>('api/notifications');
    }

    /**
     * Update notifications
     *
     * @param notifications
     */
    updateNotifications(notifications: Notification): Observable<Notification> {
        return this._httpClient.put<Notification>('api/notifications', notifications);
    }

    /**
     * Get blocked users
     */
    getBlockedUsers(): Observable<User[]> {
        return this._httpClient.get<User[]>('api/users/blacklists');
    }

    /**
     * Block user
     *
     * @param id
     */
    blockUser(id: string): Observable<User> {
        return this._httpClient.post<User>('api/users/blacklists/' + id, null);
    }

    /**
     * Unblock user
     *
     * @param id
     */
    unblockUser(id: string): Observable<User> {
        return this._httpClient.delete<User>('api/users/blacklists/' + id);
    }

    /**
     * Find user for dating
     */
    getDatingUser(): Observable<User> {
        return this._httpClient.get<User>('api/dating' + this._getQuery());
    }

    /**
     * Grand candidate and get another candidate
     *
     * @param dating
     */
    dating(dating: Dating): Observable<User> {
        return this._httpClient.post<User>('api/dating' + this._getQuery(), dating);
    }

    /**
     * Create post
     *
     * @param post
     */
    createPost(post: Post): Observable<Post> {
        return this._httpClient.post<Post>('api/posts', post);
    }

    /**
     * Delete post
     *
     * @param id
     */
    deletePost(id: string): Observable<any> {
        return this._httpClient.delete('api/posts/' + id);
    }

    /**
     * Get news
     */
    getNews(): Observable<Post[]> {
        return this._httpClient.get<Post[]>('api/posts/news');
    }

    /**
     * Get favorites
     */
    getFavorites(): Observable<User[]> {
        return this._httpClient.get<User[]>('api/dating/favorites');
    }

    /**
     * Delete favorite
     */
    deleteFavorite(id: string): Observable<any> {
        return this._httpClient.delete('api/dating/favorites/' + id);
    }

    /**
     * Like
     *
     * @param postId
     */
    like(postId: string): Observable<any> {
        return this._httpClient.post(`api/posts/${postId}/like`, null);
    }

    /**
     * Unlike
     *
     * @param postId
     */
    unlike(postId: string): Observable<any> {
        return this._httpClient.delete(`api/posts/${postId}/like`);
    }

    /**
     * Add comment
     *
     * @param comment
     */
    addComment(comment: Comment): Observable<Comment> {
        return this._httpClient.post<Comment>(`api/posts/comment`, comment);
    }

    /**
     * Delete comment
     *
     * @param commentId
     */
    deleteComment(commentId: string): Observable<any> {
        return this._httpClient.delete(`api/posts/comment/${commentId}`);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create query for dating request
     */
    private _getQuery(): string {
        const sex: string = localStorage.getItem('sex');
        let minAge: string, maxAge: string;
        [minAge, maxAge] = localStorage.getItem('age').split('-');
        const interest = localStorage.getItem('interest');
        const region = localStorage.getItem('region');
        return `?sex=${sex}&minAge=${minAge}&maxAge=${maxAge}&interest=${interest}&region=${region}`;
    }
}
