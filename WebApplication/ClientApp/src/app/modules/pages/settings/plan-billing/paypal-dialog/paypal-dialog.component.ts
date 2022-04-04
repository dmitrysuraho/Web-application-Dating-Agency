import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { DialogData } from "./paypal-dialog.types";
import { render } from "creditcardpayments/creditCardPayments";

@Component({
    selector: 'attachments-dialog.component',
    templateUrl: 'paypal-dialog.component.html',
})
export class PaypalDialogComponent implements OnDestroy, OnInit, AfterViewInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _dialogRef: MatDialogRef<PaypalDialogComponent>,
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
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        render({
            id: '#paypal-buttons',
            currency: 'USD',
            value: this.data.price,
            onApprove: (details) => {
                if (details.status === 'COMPLETED') {
                    this._dialogRef.close(true);
                } else {
                    this._dialogRef.close(false);
                }
            }
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
}
