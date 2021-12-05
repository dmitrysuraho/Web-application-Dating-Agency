import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { User } from "../../../../core/user/user.types";
import { UploadService } from "../../../../core/upload/upload.service";
import { GalleryDialogComponent } from "./gallery-dialog/gallery-dialog.component";

@Component({
    selector       : 'gallery',
    templateUrl    : './gallery.component.html'
})
export class GalleryComponent
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
        private _dialog: MatDialog
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add image to gallery
     */
    addImage(): void {
        // Get input file
        const inputNode: any = document.querySelector('#galleryImage');

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            // Get data url
            reader.readAsDataURL(inputNode.files[0]);

            // Upload photo
            this._upload.uploadGallery(inputNode.files[0], this.user);
        }
    }

    /**
     * Look gallery
     */
    openGallery(): void {
        // Open dialog
        this._dialog.open(GalleryDialogComponent, {
            data: { user: this.user },
        });
    }
}
