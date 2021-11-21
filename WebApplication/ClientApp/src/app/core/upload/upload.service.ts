import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { Router } from "@angular/router";
import { of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil, tap } from "rxjs/operators";
import { UserService } from "../user/user.service";
import { User } from "../user/user.types";

@Injectable({
    providedIn: 'root'
})
export class UploadService implements OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _fireStorage: AngularFireStorage,
        private _userService: UserService,
        private _route: Router)
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
     * Upload avatar
     */
    uploadAvatar(file: File, user: User): void {
        // Create path
        const path: string = `images/${user.userId}/avatar/${Date.now()}.${file.type.substr(6)}`;

        // Upload file to storage
        this._fireStorage.upload(path, file)
            .then(() => {
                // Get photo url
                this._fireStorage.ref(path)
                    .getDownloadURL()
                    .pipe(
                        tap(() => {
                            // Delete current photo from storage
                            if (user?.photo) {
                                this._fireStorage.refFromURL(user?.photo).delete()
                                    .pipe(
                                        catchError((error) => {
                                            console.log(error);
                                            this._route.navigateByUrl('internal-error');
                                            return of(null);
                                        })
                                    );
                            }
                        }),
                        switchMap((photo: string) => {
                            // Change photo url
                            user.photo = photo;

                            // Update current user
                            return this._userService.updateCurrentUser(user)
                        }),
                        takeUntil(this._unsubscribeAll),
                        catchError((error) => {
                            console.log(error);
                            this._route.navigateByUrl('internal-error');
                            return of(null);
                        })
                    )
                    .subscribe(() => this._userService.user = user);
            })
            .catch((error) => {
                console.log(error);
                this._route.navigateByUrl('internal-error');
            });
    }

    /**
     * Upload gallery image
     *
     */
    uploadGallery(file: File, user: User): void {
        // Create path
        const path: string = `images/${user.userId}/gallery/${Date.now()}.${file.type.substr(6)}`;

        // Upload file to storage
        this._fireStorage.upload(path, file)
            .then(() => {
                // Get image url
                this._fireStorage.ref(path)
                    .getDownloadURL()
                    .pipe(
                        switchMap((image: string) => {
                            // Add image to user gallery
                            user.gallery.push(image);
                            return this._userService.addToGallery(image);
                        }),
                        takeUntil(this._unsubscribeAll),
                        catchError((error) => {
                            console.log(error);
                            this._route.navigateByUrl('internal-error');
                            return of(null);
                        })
                    )
                    .subscribe(() => this._userService.user = user);
            })
            .catch((error) => {
                console.log(error);
                this._route.navigateByUrl('internal-error');
            });
    }

    /**
     * Delete avatar
     */
    deleteAvatar(user: User): void {
        this._fireStorage.refFromURL(user?.photo).delete()
            .pipe(
                switchMap(() => {
                    user.photo = '';
                    return this._userService.updateCurrentUser(user);
                }),
                takeUntil(this._unsubscribeAll),
                catchError((error) => {
                    console.log(error);
                    this._route.navigateByUrl('internal-error');
                    return of(null);
                })
            )
            .subscribe(() => this._userService.user = user);
    }
}
