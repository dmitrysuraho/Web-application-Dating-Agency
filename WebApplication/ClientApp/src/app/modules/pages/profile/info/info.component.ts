import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { User } from "../../../../core/user/user.types";
import { UploadService } from "../../../../core/upload/upload.service";
import { UserService } from "../../../../core/user/user.service";
import { ChatService } from "../../chat/chat.service";
import { Chat } from "../../chat/chat.types";
import { ReportDialogComponent } from "app/shared/report-dialog/report-dialog.component";
import { NotificationsService } from "app/layout/common/notifications/notifications.service";
import { Dating } from "app/core/user/dating.types";

@Component({
    selector       : 'info',
    templateUrl    : './info.component.html'
})
export class InfoComponent implements OnDestroy
{
    @Input()
    currentUser: User;

    @Input()
    user: User;

    @Input()
    isDisabled: boolean;

    isFollowing: boolean;
    isBlockDisabled: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _upload: UploadService,
        private _userService: UserService,
        private _splashScreen: FuseSplashScreenService,
        private _chatService: ChatService,
        private _notificationsService: NotificationsService,
        private _dialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add/Change photo
     */
    uploadPhoto(): void {
        // Get input file
        const inputNode: any = document.querySelector('#uploadPhoto');

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            // Get data url
            reader.readAsDataURL(inputNode.files[0]);

            // Upload photo
            this._upload.uploadAvatar(inputNode.files[0], this.user);
        }
    }

    /**
     * Delete photo
     */
    deletePhoto(): void {
        this._upload.deleteAvatar(this.user);
    }

    /**
     * Follow
     */
    follow(): void {
        const dating: Dating = {
            candidate: this.user.userId,
            isLike: false,
            isIgnore: false,
            isFavorite: true
        };

        this._notificationsService.sendNotice({
            sender: this.currentUser.userId,
            action: 'favorite',
            isRead: false,
            time: Date.now().toString()
        }, this.user.userId);

        this.isFollowing = true;
        this._userService.dating(dating)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.user.isFavorite = true;
                this.isFollowing = false;
            }, () => {
                this.user.isFavorite = true;
                this.isFollowing = false;
            });
    }

    /**
     * Unfollow
     */
    unfollow(): void {
        this.isFollowing = true;
        this._userService.deleteFavorite(this.user.userId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.user.isFavorite = false;
                this.isFollowing = false;
            });
    }

    /**
     * Report
     */
    report(): void {
        this._dialog.open(ReportDialogComponent, {
            maxWidth: '320px',
            data: { user: this.user, currentUser: this.currentUser }
        });
    }

    /**
     * Block
     */
    block(): void {
        // Disable button
        this.isBlockDisabled = true;

        // Block user
        this._userService.blockUser(this.user.userId)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((user: User) => {
                // Change user block
                this.user.isBlocked = user.isBlocked;

                // Enable button
                this.isBlockDisabled = false;
            });
    }

    /**
     * Unblock
     */
    unblock(): void {
        // Disable button
        this.isBlockDisabled = true;

        // Unblock user
        this._userService.unblockUser(this.user.userId)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((user: User) => {
                // Change user block
                this.user.isBlocked = user.isBlocked;

                // Enable button
                this.isBlockDisabled = false;
            });
    }

    /**
     * Write message
     */
    writeMessage(): void {
        // Show spinner
        this._splashScreen.show();

        // Write message
        this._chatService.writeMessage(this.user.userId)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((chat: Chat) => {
                // Navigate to chat
                this._router.navigateByUrl('chat?id=' + chat.chatId);
            });
    }

    /**
     * Navigate
     *
     * @param url
     */
    navigate(url: string): void {
        this._router.navigate([url]);
    }
}
