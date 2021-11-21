import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../../../app/core/user/user.service";

@Component({
    selector       : 'dating-settings-dialog',
    templateUrl    : './dating-settings-dialog.component.html'
})
export class DatingSettingsDialogComponent {

    sex: string;
    minAge: number;
    maxAge: number;

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService,
        private _userService: UserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get dating settings
        this.sex = localStorage.getItem('sex');
        this.minAge = Number(localStorage.getItem('age').split('-')[0]);
        this.maxAge = Number(localStorage.getItem('age').split('-')[1]);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save settings
     */
    save(): void {
        // Set a new settings
        localStorage.setItem('sex', this.sex);
        localStorage.setItem('age', this.minAge + '-' + this.maxAge);

        // Reload the app
        location.reload();
    }

    /**
     * Change of age
     *
     * @param age
     */
    onAgeChange(age: {min: number, max: number}): void {
        this.minAge = age.min;
        this.maxAge = age.max;
    }
}
