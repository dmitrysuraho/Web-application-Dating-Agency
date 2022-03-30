import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DialogData } from "./attachments-dialog.types";
import { ChatService } from "../chat.service";

@Component({
    selector: 'attachments-dialog.component',
    templateUrl: 'attachments-dialog.component.html',
})
export class AttachmentsDialogComponent implements OnDestroy, OnInit {

    images: string[];
    isLoading: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _dialogRef: MatDialogRef<AttachmentsDialogComponent>,
        private _chatService: ChatService,
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
        this._chatService.getChatAttachments(this.data.chatId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((images: string[]) => {
                this.images = images
                this.isLoading = false;
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
