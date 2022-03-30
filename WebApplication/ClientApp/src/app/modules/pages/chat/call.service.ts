import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "app/core/auth/auth.service";
import { User } from "app/core/user/user.types";
import Peer from "peerjs";

@Injectable({
    providedIn: 'root'
})
export class CallService {

    private peer: Peer;
    private mediaCall: Peer.MediaConnection;

    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();

    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();

    private _connection: any = new signalR.HubConnectionBuilder()
        .withUrl("callsocket", { accessTokenFactory: () => this._authService.accessToken })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    private _receiveCall = new Subject<[string, User]>();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService
    )
    {
        // Connection SignalR
        this._connection.onclose(async () => {
            await this._connection.start();
        });
        this._connection.on("ReceiveCall", (peerId: string, user: User) => {
            this._receiveCall.next([peerId, user]);
        });
        this._connection.start();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Receive mapped object
     */
    receiveCall(): Observable<[string, User]> {
        return this._receiveCall.asObservable();
    }

    /**
     * Send call
     *
     * @param peerId
     * @param userId
     * @param user
     */
    sendCall(peerId: string, userId: string, user: User): void {
        this._connection.invoke('Send', peerId, userId.toString(), user);
    }

    /**
     * Init pear
     */
    initPeer(): string {
        if (!this.peer || this.peer.disconnected) {
            const peerJsOptions: Peer.PeerJSOption = {
                host: 'intense-earth-10956.herokuapp.com',
                port: 443,
                path: '/myapp',
                secure: true,
                debug: 3
            };
            try {
                let id = uuidv4();
                this.peer = new Peer(id, peerJsOptions);
                return id;
            } catch (error) {
                console.error(error);
            }
        }
    }

    /**
     * Establish media call
     */
    async establishMediaCall(remotePeerId: string): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().find(track => track.kind === 'video').enabled = false;

            const connection = this.peer.connect(remotePeerId);
            connection.on('error', err => {
                console.error(err);
            });

            this.mediaCall = this.peer.call(remotePeerId, stream);
            if (!this.mediaCall) {
                let errorMessage = 'Unable to connect to remote peer';
                throw new Error(errorMessage);
            }
            this.localStreamBs.next(stream);
            this.isCallStartedBs.next(true);

            this.mediaCall.on('stream',
                (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
            this.mediaCall.on('error', err => {
                console.error(err);
                this.isCallStartedBs.next(false);
            });
            this.mediaCall.on('close', () => this._onCallClose());
        }
        catch (ex) {
            console.error(ex);
            this.isCallStartedBs.next(false);
        }
    }

    /**
     * Enable call answer
     */
    async enableCallAnswer(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().find(track => track.kind === 'video').enabled = false;

            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {

                this.mediaCall = call;
                this.isCallStartedBs.next(true);

                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this._onCallClose());
            });
        }
        catch (ex) {
            console.error(ex);
            this.isCallStartedBs.next(false);
        }
    }

    /**
     * Turn on/off microphone
     *
     * @param enabled
     */
    changeMicro(enabled: boolean): void {
        const audio = this.localStreamBs?.value.getTracks().find(track => track.kind === 'audio');
        audio.enabled = enabled;
    }

    /**
     * Turn on/off video
     *
     * @param enabled
     */
    changeVideo(enabled: boolean): void {
        const video = this.localStreamBs?.value.getTracks().find(track => track.kind === 'video');
        video.enabled = enabled;
    }

    /**
     * Close media call
     */
    closeMediaCall(): void {
        this.mediaCall?.close();
        this._onCallClose();
        this.isCallStartedBs.next(false);
    }

    /**
     * Destroy peer
     */
    destroyPeer(): void {
        this.mediaCall?.close();
        this.peer?.disconnect();
        this.peer?.destroy();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On call close
     *
     * @private
     */
    private _onCallClose(): void {
        if (this.remoteStreamBs?.value) {
            this.remoteStreamBs?.value.getTracks().forEach(track => track.stop());
        }
        if (this.localStreamBs?.value) {
            this.localStreamBs?.value.getTracks().forEach(track => track.stop());
        }
    }
}
