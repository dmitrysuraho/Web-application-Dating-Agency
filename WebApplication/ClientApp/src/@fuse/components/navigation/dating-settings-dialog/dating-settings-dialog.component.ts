import { Component } from "@angular/core";

@Component({
    selector       : 'dating-settings-dialog',
    templateUrl    : './dating-settings-dialog.component.html'
})
export class DatingSettingsDialogComponent {

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Save settings
     */
    save(): void {
        localStorage.setItem('sex', 'testSex');
    }
}
