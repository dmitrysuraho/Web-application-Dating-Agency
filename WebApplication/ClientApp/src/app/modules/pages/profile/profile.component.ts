import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { registerLocaleData } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import  localeRu  from "@angular/common/locales/ru-BY";
import  localeEn  from "@angular/common/locales/en-GB";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { Observable, of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { User } from "../../../core/user/user.types";
import { UserService } from "../../../core/user/user.service";

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy
{
    user: Observable<User>;
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

        // Get current user
        this.user = this._activatedRoute.params
            .pipe(
                switchMap((params: HttpParams) => {
                    const id: string = params['id'];
                    return id ? this._userService.getUserById(id) : this._userService.getCurrentUser();
                }),
                takeUntil(this._unsubscribeAll),
                catchError(() => {
                    this._router.navigateByUrl('not-found');
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
}
