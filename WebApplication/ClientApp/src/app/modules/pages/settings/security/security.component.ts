import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { catchError, takeUntil } from "rxjs/operators";
import { Observable, of, Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { FuseAlertType } from "@fuse/components/alert";
import { UserService } from "../../../../core/user/user.service";
import firebase from "firebase/compat";
import FirebaseUser = firebase.User;

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    animations     : [fuseAnimations]
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: FormGroup;
    currentLanguage: string;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    showAlert: boolean;
    firebaseUser: Observable<FirebaseUser>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
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
    ngOnInit(): void
    {
        // Current language
        this.currentLanguage = this._translateService.currentLang;

        // Create the form
        this.securityForm = this._formBuilder.group({
            newPassword     : ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
            confirmPassword : ['', Validators.required]
        });

        // Get current firebase user
        this.firebaseUser = this._angularFireAuth.user;
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
    save(): void
    {
        // Do nothing if the form is invalid
        if (this.securityForm.invalid) return;

        // Disable the form
        this.securityForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Check confirm password
        if (this.securityForm.get('newPassword').value !== this.securityForm.get('confirmPassword').value) {

            // Re-enable the form
            this.securityForm.enable();

            // Set the alert
            this.alert = {
                type   : 'error',
                message: this._translateService.instant('common.alert.confirm-error-change-password')
            };

            // Show the alert
            this.showAlert = true;

            return;
        }

        // Change password
        this._userService.changePassword(this.securityForm.get('newPassword').value)
            .pipe(
                takeUntil(this._unsubscribeAll),
                catchError(() => {
                    // Enable the form
                    this.securityForm.enable();

                    // Reset form
                    this.securityForm.reset();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: this._translateService.instant('common.alert.error-change-password')
                    };

                    // Show the alert
                    this.showAlert = true;

                    return of(null);
                })
            )
            .subscribe(() => {

                // Enable the form
                this.securityForm.enable();

                // Reset form
                this.securityForm.reset();

                // Set the alert
                this.alert = {
                    type   : 'success',
                    message: this._translateService.instant('common.alert.success-change-password')
                };

                // Show the alert
                this.showAlert = true;
            });
    }
}
