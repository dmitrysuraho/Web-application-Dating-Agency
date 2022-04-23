import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UploadService } from "../../../../core/upload/upload.service";
import { UserService} from "../../../../core/user/user.service";
import { User } from "../../../../core/user/user.types";
import { Post } from "../../../../core/user/post.types";

@Component({
    selector       : 'posts',
    templateUrl    : './posts.component.html'
})
export class PostsComponent implements OnInit, OnDestroy {

    @Input()
    user: User;

    @Input()
    currentUser: User;

    srcFile: string;
    description: string;
    image: any;
    isCreating: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _upload: UploadService,
        private _userService: UserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
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
     * Add image
     */
    addImage(): void {
        const inputNode: any = document.querySelector('#postImage');

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.srcFile = event.target.result;
            };

            reader.readAsDataURL(inputNode.files[0]);

            this.image = inputNode.files[0];
        }
    }

    /**
     * Delete image
     */
    deleteImage(): void {
        this.srcFile = null;
        this.image = null;
    }

    /**
     * Create post
     */
    createPost(): void {
        if (this.srcFile || this.description) {
            this.isCreating = true;
            if (!this.srcFile) {
                this._postSubscription(this._userService.createPost({ description: this.description }));
            } else {
                this._upload.uploadPost(this.description, this.image, this.user)
                    .then((posts: Observable<Post>) => {
                        this._postSubscription(posts);
                    });
            }
        }
    }

    /**
     * On delete post
     */
    onDeletePost(position: number): void {
        this.user.posts.splice(position, 1);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Post subscription
     *
     * @param observable
     */
    _postSubscription(observable: Observable<any>): any {
        observable
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((post: Post) => {
                this.user.posts.unshift(post);
                this.isCreating = false;
                this.srcFile = null;
                this.description = '';
            });
    }
}
