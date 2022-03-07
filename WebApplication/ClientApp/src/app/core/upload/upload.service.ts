import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ListResult, Reference } from '@angular/fire/compat/storage/interfaces';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';
import { Post } from '../user/post.types';
import { Chat, Message } from '../../modules/pages/chat/chat.types';
import { ChatService } from '../../modules/pages/chat/chat.service';

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
        private _chatService: ChatService,
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
     *
     * @param file
     * @param user
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
     * Delete avatar
     *
     * @param user
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

    /**
     * Upload gallery image
     *
     * @param file
     * @param user
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
     * Delete image from gallery
     *
     * @param image
     */
    deleteGallery(image: string): Observable<any> {
        return this._fireStorage.refFromURL(image).delete()
            .pipe(
                switchMap(() => this._userService.deleteFromGallery(image))
            );
    }

    /**
     * Upload post image
     *
     * @param description
     * @param file
     * @param user
     */
    uploadPost(description: string, file: File, user: User): Promise<Observable<Post>> {
        // Create path
        const path: string = `images/${user.userId}/posts/${Date.now()}.${file.type.substr(6)}`;

        // Upload file to storage
        return this._fireStorage.upload(path, file)
            .then(() =>
                // Get image url
                this._fireStorage.ref(path)
                    .getDownloadURL()
                    .pipe(
                        switchMap((image: string) => this._userService.createPost({description: description, image: image})),
                        catchError((error) => {
                            console.log(error);
                            this._route.navigateByUrl('internal-error');
                            return of(null);
                        })
                    )
            )
            .catch((error) => {
                console.log(error);
                this._route.navigateByUrl('internal-error');
            });
    }

    /**
     * Delete post
     *
     * @param id
     * @param image
     */
    deletePost(id: string, image: string): Observable<any> {
        if (image) {
            return this._fireStorage.refFromURL(image).delete()
                .pipe(
                    switchMap(() => this._userService.deletePost(id)),
                    catchError((error) => {
                        console.log(error);
                        this._route.navigateByUrl('internal-error');
                        return of(null);
                    })
                );
        } else {
            return this._userService.deletePost(id);
        }
    }

    /**
     * Upload post image
     *
     * @param message
     * @param file
     * @param userId
     * @param user
     * @param chat
     * @param currentChar
     */
    uploadMessage(message: Message, file: File, userId: string, user: User, chat: Chat, currentChar: Chat): Promise<Observable<AngularFireStorageReference>> {
        // Create path
        const path: string = `images/chats/${currentChar.chatId}/${Date.now()}.${file.type.substr(6)}`;

        // Upload file to storage
        return this._fireStorage.upload(path, file)
            .then(() =>
                // Get image url
                this._fireStorage.ref(path)
                    .getDownloadURL()
                    .pipe(
                        tap((image: string) => {
                            message.messageImage = image;
                            this._chatService.sendMessage(message, userId, user, chat);
                        }),
                        catchError((error) => {
                            console.log(error);
                            this._route.navigateByUrl('internal-error');
                            return of(null);
                        })
                    )
            )
            .catch((error) => {
                console.log(error);
                this._route.navigateByUrl('internal-error');
            });
    }

    /**
     * Get chat attachments
     *
     * @param url
     */
    getChatAttachments(url: string): Observable<string[]> {
        return this._fireStorage.ref(url)
            .listAll()
            .pipe(
                switchMap((result: ListResult) => {
                    const images: string[] = [];
                    result.items.map((ref: Reference) => {
                        this._fireStorage.ref(ref.fullPath)
                            .getDownloadURL()
                            .pipe(
                                tap((image: string) => images.push(image))
                            )
                            .subscribe();
                    });
                    return of(images);
                })
            );
    }
}
