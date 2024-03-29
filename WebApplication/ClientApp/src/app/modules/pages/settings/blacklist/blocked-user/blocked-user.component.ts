import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { Subject} from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserService } from "../../../../../core/user/user.service";
import { User } from "../../../../../core/user/user.types";

@Component({
    selector       : 'blocked-user',
    templateUrl    : './blocked-user.component.html',
    encapsulation  : ViewEncapsulation.None
})
export class BlockedUserComponent implements OnInit
{
    @Input()
    blockedUser: User;

    @Input()
    isUpDivider: boolean;

    @Output()
    onBlockedUsers: EventEmitter<void> = new EventEmitter<void>();

    isBlocking: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _translateService: TranslateService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
    }

    /**
     * On destroy
     */
    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Unblock
     */
    unblock(): void {
        // Set blocking
        this.isBlocking = true;

        // Unblock user
        this._userService.unblockUser(this.blockedUser.userId)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.onBlockedUsers.emit();
                this.isBlocking = false;
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
