import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "./core/auth/auth.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

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
        private _authService: AuthService
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
        this._translateService.use('ru');
    }
}
