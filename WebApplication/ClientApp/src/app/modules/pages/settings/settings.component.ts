import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { User } from "app/core/user/user.types";
import { UserService } from "app/core/user/user.service";
import { Subscription } from "app/core/user/subscription.types";


@Component({
    selector       : 'settings',
    templateUrl    : './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'account';
    user: Observable<User>;
    subscription: Subscription;
    blockedUsers: User[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _translateService: TranslateService,
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
        // Setup available panels
        this.panels = [
            {
                id         : 'account',
                icon       : 'heroicons_outline:user-circle',
                title      : this._translateService.instant('profile.settings.account.title'),
                description: this._translateService.instant('profile.settings.account.description')
            },
            {
                id         : 'security',
                icon       : 'heroicons_outline:lock-closed',
                title      : this._translateService.instant('profile.settings.security.title'),
                description: this._translateService.instant('profile.settings.security.description')
            },
            {
                id         : 'plan-billing',
                icon       : 'heroicons_outline:credit-card',
                title      : this._translateService.instant('profile.plan-billing.title'),
                description: this._translateService.instant('profile.plan-billing.description')
            },
            {
                id         : 'notifications',
                icon       : 'heroicons_outline:bell',
                title      : this._translateService.instant('profile.settings.notifications.title'),
                description: this._translateService.instant('profile.settings.notifications.description')
            },
            {
                id         : 'blacklist',
                icon       : 'heroicons_outline:ban',
                title      : this._translateService.instant('profile.settings.blacklist.title'),
                description: this._translateService.instant('profile.settings.blacklist.description')
            },
            {
                id         : 'appearance',
                icon       : 'heroicons_outline:photograph',
                title      : this._translateService.instant('profile.settings.appearance.title'),
                description: this._translateService.instant('profile.settings.appearance.description')
            }
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get current user
        this.user = this._userService.getCurrentUser();

        // Get blocked users and subscription
        this._userService.getBlockedUsers()
            .pipe(
                switchMap((users: User[]) => {
                    this.blockedUsers = users;
                    return this._userService.getSubscription()
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((sub: Subscription) => this.subscription = sub);

        // Splash screen
        this._splashScreen.show();
        setTimeout(() => this._splashScreen.hide(), 1500);
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
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any
    {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
