import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { PrivacyPolicyDialogComponent } from "./privacy-policy-dialog/privacy-policy-dialog.component";

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    currentLanguage: string;
    minDate: Date;
    maxDate: Date;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _dialog: MatDialog,
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
        // Current language
        this.currentLanguage = this._translateService.currentLang;

        // Change language
        this._translateService.onLangChange
            .subscribe((result: any) => this.currentLanguage = result.lang);

        // Validate birthday field
        const currentDate = new Date();
        this.minDate = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
        this.maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());

        // Create the form
        this.signUpForm = this._formBuilder.group({
                sex       : ['', Validators.required],
                name      : ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-zА-Яа-я ]+$')]],
                birthday  : ['', Validators.required],
                region    : ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-zА-Яа-я., ]+$')]],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
                agreements: ['', Validators.requiredTrue]
            }
        );

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) return;

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .then(
                () => {
                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required');
                })
            .catch(
                (response) => {
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: this._translateService.instant('common.error.duplicate-email')
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    /**
     * Privacy Policy
     */
    openPrivacyPolicy(): void {
        // Open dialog
        this._dialog.open(PrivacyPolicyDialogComponent);
    }
}
