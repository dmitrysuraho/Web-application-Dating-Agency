import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Chat, Message } from './chat.types';
import { AuthService } from "../../../core/auth/auth.service";
import { User } from "../../../core/user/user.types";

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
    private _receiveMessage = new Subject<[Message, User, Chat]>();

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
        this._connection.on("ReceiveMessage", (message: Message, user: User, chat: Chat) => {
            this._receiveMessage.next([message, user, chat]);
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
     * Set chat
     *
     * @param chat
     */
    setChat(chat: Chat): Observable<Chat[]> {
        return this._chats
            .pipe(
                tap((chats: Chat[]) => {
                    if (!chats.find((c: Chat) => c.chatId == chat.chatId)) {
                        chats.unshift(chat)
                    }
                })
            );
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
     * Send message
     *
     * @param message
     * @param userId
     * @param user
     * @param chat
     */
    sendMessage(message: Message, userId: string, user: User, chat: Chat): void {
        this._connection.invoke('Send', message, userId.toString(), user, chat);
    }

    /**
     * Receive mapped object
     */
    receiveMessage(): Observable<[Message, User, Chat]> {
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
