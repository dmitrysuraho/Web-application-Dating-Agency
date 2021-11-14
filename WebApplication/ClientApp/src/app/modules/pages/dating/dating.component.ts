import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import  localeRu  from "@angular/common/locales/ru-BY";
import  localeEn  from "@angular/common/locales/en-GB";
import { Observable, Subject } from "rxjs";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { UserService } from "../../../core/user/user.service";
import { User } from "../../../core/user/user.types";

@Component({
    selector       : 'dating',
    templateUrl    : './dating.component.html',
})
export class DatingComponent implements OnInit, OnDestroy
{
    user: Observable<User>
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _userService: UserService,
        private _splashScreen: FuseSplashScreenService
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
        // Register locale data
        registerLocaleData(localeRu);
        registerLocaleData(localeEn);

        // Splash screen
        this._splashScreen.show();
        setTimeout(() => this._splashScreen.hide(), 1000);

        this.user = this._userService.getCurrentUser();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
