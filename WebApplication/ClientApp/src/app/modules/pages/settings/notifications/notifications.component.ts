import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { FuseAlertType } from "@fuse/components/alert";
import { fuseAnimations } from "@fuse/animations";
import { Notification } from 'app/core/user/notification.types';
import { UserService } from "../../../../core/user/user.service";

@Component({
    selector       : 'settings-notifications',
    templateUrl    : './notifications.component.html',
    encapsulation  : ViewEncapsulation.None,
    animations     : [fuseAnimations]
})
export class SettingsNotificationsComponent implements OnInit
{
    notificationsForm: FormGroup;
    notifications: Observable<Notification>;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    showAlert: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _translateService: TranslateService
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
        // Create the form
        this.notificationsForm = this._formBuilder.group({
            communication : [],
            email         : [],
            security      : []
        });

        // Get notifications and set values
        this._userService.getNotifications()
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((notifications: Notification) => {
                this.notificationsForm.get('communication').setValue(notifications.communication);
                this.notificationsForm.get('email').setValue(notifications.email);
                this.notificationsForm.get('security').setValue(notifications.security);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save
     */
    save(): void {
        // Do nothing if the form is invalid
        if (this.notificationsForm.invalid) return;

        // Disable the form
        this.notificationsForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Update notifications
        this._userService.updateNotifications(this.notificationsForm.value)
            .pipe(
                takeUntil(this._unsubscribeAll),
                tap(() => {

                    // Re-enable the form
                    this.notificationsForm.enable();

                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: this._translateService.instant('profile.settings.notifications.success-alert')
                    };

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe();
    }
}
