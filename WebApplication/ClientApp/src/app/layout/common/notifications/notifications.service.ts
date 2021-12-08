import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from "@microsoft/signalr";
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Notice } from 'app/layout/common/notifications/notifications.types';
import { tap } from 'rxjs/operators';
import { AuthService } from "../../../core/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class NotificationsService
{
    private _notifications: ReplaySubject<Notice[]> = new ReplaySubject<Notice[]>(1);
    private _connection: any = new signalR.HubConnectionBuilder()
        .withUrl("noticesocket", { accessTokenFactory: () => this._authService.accessToken })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    private _receiveNotice = new Subject<Notice>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService)
    {
        // Connection SignalR
        this._connection.onclose(async () => {
            await this._connection.start();
        });
        this._connection.on("ReceiveNotice", (notice: Notice) => {
            this._receiveNotice.next(notice);
        });
        this._connection.start();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notice[]>
    {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Receive mapped object
     */
    receiveNotice(): Observable<Notice> {
        return this._receiveNotice.asObservable();
    }

    /**
     * Send notice
     *
     * @param notice
     * @param userId
     */
    sendNotice(notice: Notice, userId: string): void {
        this._connection.invoke('Send', notice, userId.toString());
    }

    /**
     * Get all notifications
     */
    getAll(): Observable<Notice[]>
    {
        return this._httpClient.get<Notice[]>('api/notices').pipe(
            tap((notifications) => {
                this._notifications.next(notifications);
            })
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<any>
    {
        return this._httpClient.delete('api/notices/' + id);
    }

    /**
     * Read notice
     *
     * @param id
     * @param isRead
     */
    toggleRead(id: string, isRead: boolean): Observable<any> {
        return this._httpClient.put('api/notices/' + id, isRead);
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<any>
    {
        return this._httpClient.put('api/notices', null);
    }
}
