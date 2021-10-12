import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

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
    minDate: Date;
    maxDate: Date;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
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
        // Validate birthday field
        const currentDate = new Date();
        this.minDate = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
        this.maxDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());

        // Create the form
        this.signUpForm = this._formBuilder.group({
                sex       : ['', Validators.required],
                name      : ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-z ]+$')]],
                birthday  : ['', Validators.required],
                region    : ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-z., ]+$')]],
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
        if ( this.signUpForm.invalid )
        {
            return;
        }

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

                    // Create error message
                    let errorMessage: string = response.message.substr(10).split(' (')[0];
                    if(!errorMessage.endsWith('.')) {
                        errorMessage += '.';
                    }

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: errorMessage
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }
}
