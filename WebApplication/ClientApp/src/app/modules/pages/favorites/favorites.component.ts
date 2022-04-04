import { Component } from "@angular/core";
import { User } from "../../../core/user/user.types";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { UserService } from "../../../core/user/user.service";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector       : 'favorites',
    templateUrl    : './favorites.component.html',
    animations     : [fuseAnimations]
})
export class FavoritesComponent {

    user: User;
    favoriteUsers: User[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
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
        // Splash screen ang get favorites
        this._splashScreen.show();
        this._userService.getFavorites()
            .pipe(
                switchMap((favorites: User[]) => {
                    this.favoriteUsers = favorites;
                    return this._userService.user$;
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((user: User) => {
                this.user = user;
                this._splashScreen.hide()
            });
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
     * On delete favorite
     *
     * @param position
     */
    onDeleteFavorite(position: number): void {
        this.favoriteUsers.splice(position, 1);
    }
}
