import { Component, Input, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { User } from "../../../../core/user/user.types";

@Component({
    selector       : 'description',
    templateUrl    : './description.component.html'
})
export class DescriptionComponent implements OnInit
{
    @Input()
    user: User;

    currentLang: string;

    /**
     * Constructor
     */
    constructor(private _translateService: TranslateService)
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }
}
