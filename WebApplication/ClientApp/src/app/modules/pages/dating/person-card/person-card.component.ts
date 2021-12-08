import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { of, Subject } from "rxjs";
import { catchError, switchMap, takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { UserService } from "../../../../core/user/user.service";
import { User } from "../../../../core/user/user.types";
import { Dating } from "../../../../core/user/dating.types";
import { NotificationsService } from "../../../../layout/common/notifications/notifications.service";

@Component({
    selector       : 'person-card',
    templateUrl    : './person-card.component.html',
    animations     : [fuseAnimations]
})
export class PersonCardComponent implements OnInit, OnDestroy
{
    @Input()
    currentUser: User;

    @Input()
    user: User;

    @Output()
    onNotFound: EventEmitter<void> = new EventEmitter<void>();

    isScreenLarge: boolean;
    isScreenXSmall: boolean;
    currentLang: string;
    isBlocking: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _userService: UserService,
        private _translateService: TranslateService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _notificationsService: NotificationsService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get lang
     */
    get getLang(): string {
        return this._translateService.currentLang === 'ru' ?
            (this.currentLang = 'ru-BY') :
            (this.currentLang = 'en-GB');
    }

    /**
     * Get sex
     */
    get getSex(): string {
        if (this._translateService.currentLang === 'ru') {
            if (this.user.sex === 'Male') return 'Мужской';
            else if (this.user.sex === 'Female') return 'Женский';
            else return this.user.sex;
        } else {
            if (this.user.sex === 'Мужской') return 'Male';
            else if (this.user.sex === 'Женский') return 'Female';
            else return this.user.sex;
        }
    }

    /**
     * Get age
     */
    get getAge(): number {
        let age: number;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dob = new Date(this.user.birthday);
        const dobNow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        age = today.getFullYear() - dob.getFullYear();
        if (today < dobNow) age--;
        return age;
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
                this.isScreenLarge = matchingAliases.includes('lg');
                this.isScreenXSmall = !matchingAliases.includes('sm');
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
     * Grande ang find new candidate
     *
     * @param event
     */
    dating(event: string): void {
        // Set dating object
        const dating: Dating = {
            candidate: this.user.userId,
            isLike: event === 'like',
            isIgnore: event === 'ignore',
            isFavorite: event === 'favorite'
        };

        if (event !== 'ignore') {
            this._notificationsService.sendNotice({
                sender: this.currentUser.userId,
                action: event,
                isRead: false,
                time: Date.now().toString()
            }, this.user.userId);
        }

        // Set candidate in null
        this.user = null;

        // Dating and get new candidate
        this._userService.dating(dating)
            .pipe(
                takeUntil(this._unsubscribeAll),
                catchError(() => {
                    this.onNotFound.emit();
                    return of(null);
                })
            )
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    /**
     * Block candidate and find new
     */
    block(): void {
        // Set blocking
        this.isBlocking = true;

        // Block and find new
        this._userService.blockUser(this.user.userId)
            .pipe(
                switchMap(() => {
                    // Unset blocking
                    this.isBlocking = false;

                    // Set candidate in null
                    this.user = null;

                    // Find new candidate
                    return this._userService.getDatingUser();
                }),
                takeUntil(this._unsubscribeAll),
                catchError(() => {
                    this.onNotFound.emit();
                    return of(null);
                })
            )
            .subscribe((user: User) => this.user = user);
    }
}
