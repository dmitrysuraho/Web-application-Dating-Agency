import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { DateAdapter, MAT_DATE_LOCALE } from "@angular/material/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { FuseAlertType } from "@fuse/components/alert";
import { fuseAnimations } from "@fuse/animations";
import { of, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    providers      : [{ provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }],
    animations     : [fuseAnimations]
})
export class SettingsAccountComponent implements OnInit, OnDestroy
{
    @Input()
    user: User;
    accountForm: FormGroup;
    currentLanguage: string;
    minDate: Date;
    maxDate: Date;
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
        private _translateService: TranslateService,
        private _dateAdapter: DateAdapter<any>,
        private _userService: UserService,
        private _angularFireAuth: AngularFireAuth
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Current language
        this.currentLanguage = this._translateService.currentLang;
        this._dateAdapter.setLocale(this._translateService.currentLang);

        // Validate birthday field
        const currentDate = new Date();
        this.minDate = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
        this.maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());

        // Create the form
        this.accountForm = this._formBuilder.group({
            sex:      [this.user.sex, Validators.required],
            name:     [this.user.name, [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-zА-Яа-я ]+$')]],
            birthday: [this.user.birthday.toString() !== '0001-01-01T00:00:00' ? this.user.birthday : '', Validators.required],
            region:   [this.user.region, [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-zА-Яа-я., ]+$')]],
            about:    [this.user.about],
            email:    [this.user.email, [Validators.required, Validators.email]],
            phone:    [this.user.phone, [Validators.required, Validators.minLength(7), Validators.maxLength(20), Validators.pattern('^(\\+)?(\\(\\d{2,3}\\) ?\\d|\\d)(([ \\-]?\\d)|( ?\\(\\d{2,3}\\) ?)){5,12}\\d$')]],
        });

        // Email disable
        this._emailDisable();
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
        if (this.accountForm.invalid) return;

        // Disable the form
        this.accountForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Create user with updates
        const user: User = {
            ...this.accountForm.value,
            photo: this.user.photo
        };

        // Update current user
        this._userService.updateCurrentUser(user)
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((user: User) => {
                // Re-set current user data
                this.user = user;

                // Re-enable the form
                this.accountForm.enable();

                // Set the alert
                this.alert = {
                    type   : 'success',
                    message: this._translateService.instant('profile.settings.account.success-alert')
                };

                // Show the alert
                this.showAlert = true;

                // Email disable
                this._emailDisable();
            },
            error => {
                console.log(error);

                // Re-enable the form
                this.accountForm.enable();

                // Set the alert
                if (error.status === 409) {
                    if (error.error.field === 'email') {
                        this.alert = {
                            type   : 'error',
                            message: this._translateService.instant('common.alert.duplicate-email')
                        };
                    } else {
                        this.alert = {
                            type   : 'error',
                            message: this._translateService.instant('common.alert.duplicate-phone')
                        };
                    }
                } else {
                    this.alert = {
                        type   : 'error',
                        message: error.message
                    };
                }

                // Show the alert
                this.showAlert = true;

                // Email disable
                this._emailDisable();

                return of(null);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Email disable
     */
    _emailDisable(): void {
        // Check provider
        this._angularFireAuth.authState
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(user => {
                if (user?.providerData[0].providerId === 'password') {
                    this.accountForm.get('email').disable();
                }
            });
    }
}
