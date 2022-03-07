import { Component, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { DialogData } from "./attachments-dialog.types";

@Component({
    selector: 'attachments-dialog.component',
    templateUrl: 'attachments-dialog.component.html',
})
export class AttachmentsDialogComponent implements OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _dialogRef: MatDialogRef<AttachmentsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

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
