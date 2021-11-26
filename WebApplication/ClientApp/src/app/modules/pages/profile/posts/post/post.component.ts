import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { UploadService } from "../../../../../core/upload/upload.service";
import { UserService } from "../../../../../core/user/user.service";
import { takeUntil } from "rxjs/operators";
import { Post } from "../../../../../core/user/post.types";
import { User } from "../../../../../core/user/user.types";

@Component({
    selector       : 'post',
    templateUrl    : './post.component.html'
})
export class PostComponent implements OnInit, OnDestroy {

    @Input()
    post: Post;

    @Input()
    user: User;

    @Input()
    position: number;

    @Output()
    onDeletePost: EventEmitter<number> = new EventEmitter<number>();

    isDeleting: boolean;
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
     * Delete post
     */
    deletePost(): void {
        this.isDeleting = true;
        this._upload.deletePost(this.post.postId, this.post.image)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.onDeletePost.emit(this.position);
                this.isDeleting = false;
            });
    }
}
