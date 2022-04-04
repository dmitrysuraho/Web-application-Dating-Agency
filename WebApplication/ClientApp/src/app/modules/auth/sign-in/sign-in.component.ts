import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    currentLanguage: string;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
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

        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if (this.signInForm.invalid) return;

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .then(
                () => {
                    // Set the redirect url
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                })
            .catch(
                (response) => {
                    // Re-enable the form
                    this.signInForm.enable();

                    // Create error message
                    let errorMessage: string;
                    if (response.message.includes('has been disabled')) {
                        errorMessage = this._translateService.instant('common.alert.disabled-user');
                    } else {
                        errorMessage = this._translateService.instant('common.alert.wrong-email-or-password');
                    }

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: errorMessage
                    };

                    // Show the alert
                    this.showAlert = true;
                });
    }

    /**
     * Sign in with Google
     */
    googleSignIn(): void {
        // Sign in
        this._authService.googleSignIn();
    }

    /**
     * Sign in with Twitter
     */
    twitterSignIn(): void {
        // Sign in
        this._authService.twitterSignIn();
    }

    /**
     * Sign in with Github
     */
    githubSignIn(): void {
        // Sign in
        this._authService.githubSignIn();
    }
}
