import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { DOCUMENT } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { of, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { PaypalDialogComponent } from "./paypal-dialog/paypal-dialog.component";
import { User } from "app/core/user/user.types";
import { UserService } from "app/core/user/user.service";
import { Subscription } from "app/core/user/subscription.types";

@Component({
    selector       : 'settings-plan-billing',
    templateUrl    : './plan-billing.component.html'
})
export class SettingsPlanBillingComponent implements OnInit, OnDestroy
{
    @Input()
    user: User;

    @Input()
    subscription: Subscription;

    @ViewChild('planRadioGroup')
    selectedPlan: HTMLElement;

    planBillingForm: FormGroup;
    plans: any[];
    isBuy: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private _formBuilder: FormBuilder,
        private _dialog: MatDialog,
        private _userService: UserService,
        private _translateService: TranslateService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get lang
     */
    get getLang(): string {
        return this._translateService.currentLang === 'ru' ? 'ru-BY' :'en-GB';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.planBillingForm = this._formBuilder.group({
            plan: ['']
        });

        // Setup the plans
        this.plans = [
            {
                value  : '5',
                label  : this._translateService.instant('profile.plan-billing.plan-1-title'),
                details: this._translateService.instant('profile.plan-billing.plan-1-description'),
                price  : '5',
                month  : 1
            },
            {
                value  : '20',
                label  : this._translateService.instant('profile.plan-billing.plan-2-title'),
                details: this._translateService.instant('profile.plan-billing.plan-2-description'),
                price  : '20',
                month  : 6
            },
            {
                value  : '40',
                label  : this._translateService.instant('profile.plan-billing.plan-3-title'),
                details: this._translateService.instant('profile.plan-billing.plan-3-description'),
                price  : '40',
                month  : 12
            }
        ];
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
     * Buy subscription
     */
    buySubscription(): void {
        // @ts-ignore
        const plan = this.plans.find(plan => plan.price ===  this.selectedPlan.value);
        const end: Date = new Date();
        end.setMonth(end.getMonth() + plan.month);
        const dialogRef = this._dialog.open(PaypalDialogComponent, {
            panelClass: 'paypal',
            data: {
                price: plan.price
            }
        });

        dialogRef.afterClosed()
            .pipe(
                switchMap(result => result ? this._userService.buySubscription(end) : of(null)),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((sub: Subscription) => {
                if (sub) {
                    this.user.isPlus = true;
                    this._userService.user = this.user;
                    this.subscription = sub;
                    this.isBuy = true;
                }
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
