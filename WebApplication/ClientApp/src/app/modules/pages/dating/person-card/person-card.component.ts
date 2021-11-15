import {
    Component, Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { UserService } from "../../../../core/user/user.service";
import { User } from "../../../../core/user/user.types";

@Component({
    selector       : 'person-card',
    templateUrl    : './person-card.component.html',
    animations     : [fuseAnimations]
})
export class PersonCardComponent implements OnInit, OnDestroy
{
    @Input()
    user: User;

    currentLang: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
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
        return this._translateService.currentLang === 'ru' ?
            (this.currentLang = 'ru-BY') :
            (this.currentLang = 'en-GB');
    }

    /**
     * Get sex
     */
    get getSex(): string {
        if (this._translateService.currentLang === 'ru') {
            if (this.user.sex === 'Male') return 'Мужской';
            else if (this.user.sex === 'Female') return 'Женский';
            else return this.user.sex;
        } else {
            if (this.user.sex === 'Мужской') return 'Male';
            else if (this.user.sex === 'Женский') return 'Female';
            else return this.user.sex;
        }
    }

    /**
     * Get age
     */
    get getAge(): number {
        let age: number;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dob = new Date(this.user.birthday);
        const dobNow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        age = today.getFullYear() - dob.getFullYear();
        if (today < dobNow) age--;
        return age;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Ignore
     */
    ignore(): void {
        // Set user in null
        this.user = null;

        // Get the next user
        this._userService.getUserById('1')
            .subscribe((user) => this.user = user);
    }

    /**
     * Like
     */
    like(): void {

    }
}
