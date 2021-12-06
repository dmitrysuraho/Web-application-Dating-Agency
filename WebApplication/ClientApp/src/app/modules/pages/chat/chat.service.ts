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
    private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(null);
    private _resetChat: Subject<void> = new Subject();
    private _connection: any = new signalR.HubConnectionBuilder()
        .withUrl("chatsocket", { accessTokenFactory: () => this._authService.accessToken })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    private _receiveMessage = new Subject<Message>();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    )
    {
        // Connection SignalR
        this._connection.onclose(async () => {
            await this._connection.start();
        });
        this._connection.on("ReceiveMessage", (message: Message) => {
            this._receiveMessage.next(message);
        });
        this._connection.start();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for chats
     */
    get chats$(): Observable<Chat[]>
    {
        return this._chats.asObservable();
    }

    /**
     * Getter for reset chat
     */
    get resetChat$(): Observable<void> {
        return this._resetChat.asObservable();
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
        return this._httpClient.get<Chat>('api/chats/' + id);
    }

    /**
     * Reset chat
     */
    resetChat(): void {
        this._resetChat.next();
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
        this._connection.invoke('Send', message, userId.toString());
    }

    /**
     * Receive mapped object
     */
    receiveMessage(): Observable<Message> {
        return this._receiveMessage.asObservable();
    }

    /**
     * Read messages
     *
     * @param id
     */
    readMessages(id: string): Observable<any> {
        return this._httpClient.put('api/chats/' + id, null);
    }
}
