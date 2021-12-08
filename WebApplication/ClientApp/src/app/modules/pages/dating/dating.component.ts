import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import  localeRu  from "@angular/common/locales/ru-BY";
import  localeEn  from "@angular/common/locales/en-GB";
import { Observable, of, Subject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { fuseAnimations } from "@fuse/animations";
import { UserService } from "../../../core/user/user.service";
import { User } from "../../../core/user/user.types";

@Component({
    selector       : 'dating',
    templateUrl    : './dating.component.html',
    animations     : [fuseAnimations]
})
export class DatingComponent implements OnInit, OnDestroy
{
    currentUser: User;
    user: Observable<User>;
    isNotFound: boolean;
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

        // Get current user
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.currentUser = user;
            });

        // Get candidate
        this.user = this._userService.getDatingUser()
            .pipe(
                takeUntil(this._unsubscribeAll),
                catchError(() => {
                    this.isNotFound = true;
                    return of(null);
                })
            );
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Not found error
     */
    notFoundError(): void {
        this.isNotFound = true;
    }
}
