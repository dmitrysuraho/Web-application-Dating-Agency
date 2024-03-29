import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector       : 'languages',
    templateUrl    : './languages.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'languages'
})
export class LanguagesComponent implements OnInit
{
    availableLangs: any[] = [
        {
            id: 'ru',
            label: 'Русский'
        },
        {
            id: 'en',
            label: 'English'
        }
    ];
    activeLang: string;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(
        private _translateService: TranslateService
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
        // Set the language
        this.activeLang = this._translateService.currentLang;

        // Set the country iso codes for languages for flags
        this.flagCodes = {
            'ru': 'ru',
            'en': 'us'
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void
    {
        // Set language and reload the page
        localStorage.setItem('lang', lang);
        location.reload();
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
