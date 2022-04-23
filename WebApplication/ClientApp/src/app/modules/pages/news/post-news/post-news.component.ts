import { Component, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UploadService } from "app/core/upload/upload.service";
import { UserService } from "app/core/user/user.service";
import { Post, Comment } from "app/core/user/post.types";
import { User } from "app/core/user/user.types";

@Component({
    selector       : 'post-news',
    templateUrl    : './post-news.component.html'
})
export class PostNewsComponent implements OnDestroy {

    @Input()
    post: Post;

    @Input()
    owner: User;

    @Input()
    currentUser: User;

    commentText: string;
    isSendingComment: boolean = false;
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
     * Like
     */
    like(): void {
        this._userService.like(this.post.postId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
               this.post.isLike = true;
               this.post.likesCount++;
            });
    }

    /**
     * Unlike
     */
    unlike(): void {
        this._userService.unlike(this.post.postId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.post.isLike = false;
                this.post.likesCount--;
            });
    }

    /**
     * Send comment
     */
    sendComment(): void {
        if (!this.commentText.trim()) return;

        const comment: Comment = {
            commentText: this.commentText,
            postId: this.post.postId,
            userId: this.currentUser.userId
        };

        this.isSendingComment = true;
        this._userService.addComment(comment)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((comment: Comment) => {
                this.post.comments.unshift(comment);
                this.post.commentsCount++;
                this.commentText = '';
                this.isSendingComment = false;
            });
    }

    /**
     * Delete comment
     *
     * @param index
     * @param commentId
     */
    deleteComment(index: number, commentId: string): void {
        this._userService.deleteComment(commentId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.post.comments.splice(index, 1);
                this.post.commentsCount--;
            });
    }
}
