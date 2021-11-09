import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { UserService } from "../../../core/user/user.service";

@Component({
    selector       : 'dating',
    templateUrl    : './dating.component.html',
})
export class DatingComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _userService: UserService
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
