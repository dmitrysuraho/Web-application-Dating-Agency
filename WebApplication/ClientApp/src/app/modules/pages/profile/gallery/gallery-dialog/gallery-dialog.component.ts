import { Component, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { catchError, takeUntil } from "rxjs/operators";
import { of, Subject } from "rxjs";
import { DialogData } from "./gallery-dialog.types";
import { UploadService } from "../../../../../core/upload/upload.service";

@Component({
    selector: 'gallery-dialog.component',
    templateUrl: 'gallery-dialog.component.html',
})
export class GalleryDialogComponent implements OnDestroy {

    isDeleting: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _dialogRef: MatDialogRef<GalleryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _uploadService: UploadService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

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
     * Delete image from gallery
     *
     * @param position
     * @param image
     */
    deleteImage(position: number, image: string): void {
        // Set deleting for spinner
        this.isDeleting = true;

        // Delete image from gallery
        this._uploadService.deleteGallery(image)
            .pipe(
                takeUntil(this._unsubscribeAll),
                catchError((error) => {
                    console.log(error);
                    this._dialogRef.close();
                    this._router.navigateByUrl('internal-error');
                    return of(null);
                })
            )
            .subscribe(() => {
                this.data.user.gallery.splice(position, 1);
                this.isDeleting = false;

                // Check if no images
                if (!this.data.user.gallery.length) {
                    this._dialogRef.close();
                }
            });
    }
}
