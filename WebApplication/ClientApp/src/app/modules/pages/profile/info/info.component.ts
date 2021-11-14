import { Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { User } from "../../../../core/user/user.types";
import { UploadService } from "../../../../core/upload/upload.service";
import { UserService } from "../../../../core/user/user.service";

@Component({
    selector       : 'info',
    templateUrl    : './info.component.html'
})
export class InfoComponent implements OnDestroy
{
    @Input()
    user: User;

    isBlockDisabled: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _upload: UploadService,
        private _userService: UserService
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
    uploadPhoto() {
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
    deletePhoto() {
        this._upload.deleteAvatar(this.user);
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
     * Navigate
     */
    navigate(url: string) {
        this._router.navigate([url]);
    }
}
