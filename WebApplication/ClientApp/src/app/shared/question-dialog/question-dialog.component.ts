import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Subject } from "rxjs";
import emailJs, { EmailJSResponseStatus } from "@emailjs/browser";

@Component({
    selector: 'report-dialog.component',
    templateUrl: 'question-dialog.component.html',
})
export class QuestionDialogComponent implements OnInit, OnDestroy {

    questionForm: FormGroup;
    failText: string;
    isSuccess: boolean;
    isFail: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService,
        private _formBuilder: FormBuilder
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
        // Create the form
        this.questionForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            description: ['', [Validators.required]]
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
     * Send report
     *
     * @param event
     */
    sendReport(event: Event): void {
        event.preventDefault();
        this.isFail = false;
        if (this.questionForm.invalid) {
            this.isFail = true;
            this.failText = this._translateService.instant('question-dialog.fail-alert');
            return;
        }
        this.questionForm.disable();
        emailJs.sendForm('service_1yt3zwc', 'template_olun2uv', event.target as HTMLFormElement, 'BO9wpFNiCkzEZbPiH')
            .then((result: EmailJSResponseStatus) => {
                this.isSuccess = true;
                this.questionForm.enable();
            }, (error) => {
                this.isFail = true;
                this.failText = error.text;
                this.questionForm.enable();
            });
    }
}
