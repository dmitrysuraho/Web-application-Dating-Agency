import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { UserService } from "../../../../core/user/user.service";
import { User } from "../../../../core/user/user.types";

@Component({
    selector       : 'settings-blacklist',
    templateUrl    : './blacklist.component.html',
    animations     : [fuseAnimations]
})
export class SettingsBlacklistComponent implements OnInit
{
    @Input()
    blockedUsers: User[];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _translateService: TranslateService
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
     * Update blocked users
     *
     * @param position
     */
    updateBlockedUsers(position: number): void {
        this.blockedUsers.splice(position, 1);
    }
}
