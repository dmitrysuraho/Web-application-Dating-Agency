import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Chat, Message } from './chat.types';
import { AuthService } from "../../../core/auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class ChatService
{
    private _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
    private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(null);
    private  connection: any = new signalR.HubConnectionBuilder()
        .withUrl("chatsocket", { accessTokenFactory: () => this._authService.accessToken })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    private sharedObj = new Subject<Message>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    )
    {
        // Connection SignalR
        this.connection.onclose(async () => {
            await this.connection.start();
        });
        this.connection.on("ReceiveMessage", (message: Message) => {
            this.sharedObj.next(message);
        });
        this.connection.start();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for chat
     */
    get chat$(): Observable<Chat>
    {
        return this._chat.asObservable();
    }

    /**
     * Getter for chats
     */
    get chats$(): Observable<Chat[]>
    {
        return this._chats.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get chats
     */
    getChats(): Observable<Chat[]>
    {
        return this._httpClient.get<Chat[]>('api/chats')
            .pipe(
                tap((chats: Chat[]) => this._chats.next(chats))
            );
    }

    /**
     * Get chat
     *
     * @param id
     */
    getChatById(id: string): Observable<Chat>
    {
        return this._httpClient.get<Chat>('api/chats/' + id)
            .pipe(
                tap((chat: Chat) => this._chat.next(chat))
            );
    }

    /**
     * Reset the selected chat
     */
    resetChat(): void
    {
        this._chat.next(null);
    }

    /**
     * Write message
     *
     * @param id
     */
    writeMessage(id: string): Observable<Chat> {
        return this._httpClient.post<Chat>('api/chats', id);
    }

    /**
     * Broadcast message
     *
     * @param message
     * @param userId
     */
    sendMessage(message: Message, userId: string): void {
        this.connection.invoke('Send', message, userId.toString());
    }

    /**
     * Receive mapped object
     */
    receiveMessage(): Observable<Message> {
        return this.sharedObj.asObservable();
    }
}
