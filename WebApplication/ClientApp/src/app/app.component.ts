import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "./core/auth/auth.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { User } from "./core/user/user.types";
import { UserService } from "./core/user/user.service";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService,
        private _authService: AuthService,
        private _userService: UserService
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
        // Set interval to refresh token
        this._authService.refreshToken()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
        setInterval(() =>
            this._authService.refreshToken()
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(), 3500 * 1000);

        // Set default language
        if (localStorage.getItem('lang')) {
            this._translateService.use(localStorage.getItem('lang'));
        } else {
            this._translateService.use('ru');
        }

        // Set default dating settings
        this._userService.user$
            .subscribe((user: User) => {
                // Set sex
                if (!localStorage.getItem('sex')) {
                    localStorage.setItem('sex', 'All');
                }

                // Set age
                if (!localStorage.getItem('age')) {
                    localStorage.setItem('age', '18-30');
                }
            });
    }
}
