import { Component } from "@angular/core";
import { Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { fuseAnimations } from "@fuse/animations";
import { User } from "app/core/user/user.types";
import { UserService } from "app/core/user/user.service";
import { Post } from "app/core/user/post.types";

@Component({
    selector       : 'news',
    templateUrl    : './news.component.html',
    animations     : [fuseAnimations]
})
export class NewsComponent {

    currentUser: User;
    posts: Post[];
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
        // Splash screen ang get news
        this._splashScreen.show();
        this._userService.user$
            .pipe(
                switchMap((user: User) => {
                    this.currentUser = user;
                    return this._userService.getNews();
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((posts: Post[]) => {
                this.posts = posts;
                this._splashScreen.hide();
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
}
