import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { UserService } from "../../../../core/user/user.service";
import { User } from "../../../../core/user/user.types";

@Component({
    selector       : 'settings-blacklist',
    templateUrl    : './blacklist.component.html'
})
export class SettingsBlacklistComponent implements OnInit
{
    @Input()
    blockedUsers: User[];

    @Output()
    onBlockedUsers: EventEmitter<User[]> = new EventEmitter<User[]>();

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
     * @param blockedUsers
     */
    updateBlockedUsers(blockedUsers: User[]): void {
        this.onBlockedUsers.emit(blockedUsers);
    }
}
