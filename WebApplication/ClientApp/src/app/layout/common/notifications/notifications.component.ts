import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { registerLocaleData } from "@angular/common";
import  localeRu  from "@angular/common/locales/ru-BY";
import  localeEn  from "@angular/common/locales/en-GB";
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notice } from 'app/layout/common/notifications/notifications.types';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';

@Component({
    selector       : 'notifications',
    templateUrl    : './notifications.component.html',
    exportAs       : 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy
{
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    notifications: Notice[];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _route: Router,
        private _translateService: TranslateService
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
        return this._translateService.currentLang === 'ru' ? 'ru-BY' : 'en-GB';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Register locale data
        registerLocaleData(localeRu);
        registerLocaleData(localeEn);

        // Subscribe to notification changes
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: Notice[]) => {
                // Load the notifications
                this.notifications = notifications.map((notice: Notice) => {
                    notice.title = this._translateService.instant(notice.action === 'like'  ? 'notifications.like.title' : 'notifications.favorite.title');
                    notice.description = this._translateService.instant(notice.action === 'like'  ? 'notifications.like.description' : 'notifications.favorite.description');
                    notice.icon = notice.action === 'like' ? 'heroicons_solid:heart' : 'heroicons_solid:star';
                    notice.link = 'profile/' + notice.sender;
                    return notice;
                });

                // Calculate the unread count
                this._calculateUnreadCount();
            });

        // Receive notice
        this._notificationsService.receiveNotice()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notice: Notice) => {
                // Create and add new notice
                notice.title = this._translateService.instant(notice.action === 'like'  ? 'notifications.like.title' : 'notifications.favorite.title');
                notice.description = this._translateService.instant(notice.action === 'like'  ? 'notifications.like.description' : 'notifications.favorite.description');
                notice.icon = notice.action === 'like' ? 'heroicons_solid:heart' : 'heroicons_solid:star';
                notice.link = 'profile/' + notice.sender;
                this.notifications.unshift(notice);

                // Calculate the unread count
                this._calculateUnreadCount();
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

        // Dispose the overlay
        if ( this._overlayRef )
        {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate
     *
     * @param notice
     */
    navigate(notice: Notice): void {
        // Navigate
        this._route.navigateByUrl(notice.link);

        // Close panel
        this.closePanel();

        // Read notice
        if (!notice.isRead) this.toggleRead(notice);
    }

    /**
     * Open the notifications panel
     */
    openPanel(): void
    {
        // Return if the notifications panel or its origin is not defined
        if ( !this._notificationsPanel || !this._notificationsOrigin )
        {
            return;
        }

        // Create the overlay if it doesn't exist
        if ( !this._overlayRef )
        {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Close the messages panel
     */
    closePanel(): void
    {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): void
    {
        // Mark all as read
        this._notificationsService.markAllAsRead()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.notifications = this.notifications.map((notification: Notice) => {
                   notification.isRead = true;
                   return notification;
                });

                // Calculate the unread count
                this._calculateUnreadCount();
            });
    }

    /**
     * Toggle read status of the given notification
     *
     * @param notification
     */
    toggleRead(notification: Notice): void
    {
        // Read notice
        this._notificationsService.toggleRead(notification.noticeId, !notification.isRead)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                notification.isRead = !notification.isRead;

                // Calculate the unread count
                this._calculateUnreadCount();
            });
    }

    /**
     * Delete the given notification
     *
     * @param notification
     * @param position
     */
    delete(notification: Notice, position: number): void
    {
        // Delete the notification
        this._notificationsService.delete(notification.noticeId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.notifications.splice(position, 1);

                // Calculate the unread count
                this._calculateUnreadCount();
            });
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

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void
    {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop     : true,
            backdropClass   : 'fuse-backdrop-on-mobile',
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                                  .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                                  .withLockedPosition(true)
                                  .withPush(true)
                                  .withPositions([
                                      {
                                          originX : 'start',
                                          originY : 'bottom',
                                          overlayX: 'start',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'start',
                                          originY : 'top',
                                          overlayX: 'start',
                                          overlayY: 'bottom'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'bottom',
                                          overlayX: 'end',
                                          overlayY: 'top'
                                      },
                                      {
                                          originX : 'end',
                                          originY : 'top',
                                          overlayX: 'end',
                                          overlayY: 'bottom'
                                      }
                                  ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void
    {
        let count = 0;

        if ( this.notifications && this.notifications.length )
        {
            count = this.notifications.filter(notification => !notification.isRead).length;
        }

        this.unreadCount = count;
    }
}
