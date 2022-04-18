import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { CallService } from "../call.service";
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'call-dialog.component',
    templateUrl: 'call-dialog.component.html'
})
export class CallDialogComponent implements OnDestroy, OnInit {

    public isCallStarted$: Observable<boolean>;

    isRemoteVideoVisible: boolean = false;
    isAnswer: boolean;
    isAcceptCall: boolean = false;
    isMircoOn: boolean = true;
    isVideoOn: boolean = false;

    @ViewChild('localVideo')
    localVideo: ElementRef<HTMLVideoElement>;

    @ViewChild('remoteVideo')
    remoteVideo: ElementRef<HTMLVideoElement>;

    private _peerId: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _callService: CallService,
        private _dialogRef: MatDialogRef<CallDialogComponent>,
        private _dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: { user: User, userId: string, joinCall: boolean, peerId: string, member: User }
    )
    {
        this.isAnswer = this.data.joinCall;
        this.isCallStarted$ = this._callService.isCallStarted$;
        this._peerId = this._callService.initPeer();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._callService.receiveCall()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(([peerId, user]: [string, User]) => {
                if (!peerId) {
                    this._callService.closeMediaCall();
                    this._dialogRef.close();
                } else {
                    switch (peerId) {
                        case 'video-off':
                            this.isRemoteVideoVisible = false;
                            break;
                        case 'video-on':
                            this.isRemoteVideoVisible = true;
                            break;
                    }
                }
            });

        this._callService.localStream$
            .pipe(
                filter(res => !!res),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(stream => {
                if (this.localVideo?.nativeElement) {
                    this.localVideo.nativeElement.srcObject = stream;
                }
            });

        this._callService.remoteStream$
            .pipe(
                filter(res => !!res),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(stream => {
                if (this.remoteVideo?.nativeElement) {
                    this.remoteVideo.nativeElement.srcObject = stream;
                    this.isAcceptCall = true;
                }
            });

        if (!this.data.joinCall) {
            this._callService.enableCallAnswer()
                .then(() => this._callService.sendCall(this._peerId, this.data.userId, this.data.user));
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Destroy peer
        this._callService.destroyPeer();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Accept call
     */
    _acceptCall(): void {
        this._callService.establishMediaCall(this.data.peerId)
            .then(() => {
                this.isAnswer = false;
                this._dialogRef.updateSize('100%', '100%');
                this._dialogRef.addPanelClass('no-dialog-radius');
            });
    }

    /**
     * Cancel call
     */
    _cancelCall(): void {
        this._endCall();
    }

    /**
     * End call
     */
    _endCall(): void {
        this._callService.sendCall('', this.data.userId, this.data.user);
        this._callService.closeMediaCall();
        this._dialogRef.close();
    }

    /**
     * Turn on/off microphone
     */
    _changeMicro(): void {
        this.isMircoOn = !this.isMircoOn;
        this._callService.changeMicro(this.isMircoOn);
    }

    /**
     * Turn on/off video
     */
    _changeVideo(): void {
        this.isVideoOn = !this.isVideoOn;
        this._callService.changeVideo(this.isVideoOn);
        const peerId: string = this.isVideoOn ? 'video-on' : 'video-off';
        this._callService.sendCall(peerId, this.data.userId, this.data.user);
    }
}
