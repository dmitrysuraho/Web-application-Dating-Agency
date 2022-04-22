import { Component, Input } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { User } from "../../../../core/user/user.types";
import { UploadService } from "../../../../core/upload/upload.service";

@Component({
    selector       : 'favorites',
    templateUrl    : './favorites.component.html'
})
export class FavoritesComponent
{
    @Input()
    user: User;

    isScreenSmall: boolean;
    isScreenLarge: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _upload: UploadService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
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
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.length;

                // Check if the screen is large
                this.isScreenLarge = matchingAliases.includes('lg');
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
