import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";
import {Chat} from "../../chat/chat.types";
import { ChatService } from "../../chat/chat.service";

@Component({
    selector       : 'favorite-person',
    templateUrl    : './favorite-person.component.html',
})
export class FavoritePersonComponent implements OnDestroy{

    @Input()
    favoriteUser: User;

    @Output()
    onDeleteFavorite: EventEmitter<void> = new EventEmitter<void>();

    isDeleting: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _userService: UserService,
        private _chatService: ChatService,
        private _splashScreen: FuseSplashScreenService
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
     * Delete favorite
     */
    deleteFavorite(): void {
        this.isDeleting = true;
        this._userService.deleteFavorite(this.favoriteUser.userId)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.onDeleteFavorite.emit();
                this.isDeleting = false;
            });
    }

    /**
     * Write message
     */
    writeMessage(): void {
        // Show spinner
        this._splashScreen.show();

        // Write message
        this._chatService.writeMessage(this.favoriteUser.userId)
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
     * @param id
     */
    navigateToProfile(url: string, id: string): void
    {
        this._router.navigate([url, id]);
    }
}
