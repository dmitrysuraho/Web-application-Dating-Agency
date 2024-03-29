import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogData } from "./report-dialog.types";
import emailJs, { EmailJSResponseStatus } from "@emailjs/browser";

@Component({
    selector: 'report-dialog.component',
    templateUrl: 'report-dialog.component.html',
})
export class ReportDialogComponent implements OnInit, OnDestroy {

    reportForm: FormGroup;
    failText: string;
    isSuccess: boolean;
    isFail: boolean;
    srcFile: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService,
        private _formBuilder: FormBuilder,
        private _dialogRef: MatDialogRef<ReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
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
        this.reportForm = this._formBuilder.group({
            email: [this.data.currentUser?.email, [Validators.required, Validators.email]],
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
     * Add image
     */
    addImage(): void {
        const inputNode: any = document.querySelector('#proof');

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.srcFile = event.target.result;
            };

            reader.readAsDataURL(inputNode.files[0]);
        }
    }

    /**
     * Send report
     *
     * @param event
     */
    sendReport(event: Event): void {
        event.preventDefault();
        this.isFail = false;
        if (this.reportForm.invalid || !this.srcFile) {
            this.isFail = true;
            this.failText = this._translateService.instant('report-dialog.fail-alert');
            return;
        }
        this.reportForm.disable();
        emailJs.sendForm('service_1yt3zwc', 'template_1xhzx39', event.target as HTMLFormElement, 'BO9wpFNiCkzEZbPiH')
            .then((result: EmailJSResponseStatus) => {
                this.isSuccess = true;
                this.reportForm.enable();
            }, (error) => {
                this.isFail = true;
                this.failText = error.text;
                this.reportForm.enable();
            });
    }
}
