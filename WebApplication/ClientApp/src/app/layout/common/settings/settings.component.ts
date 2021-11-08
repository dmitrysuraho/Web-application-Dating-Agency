import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config';
import { FuseTailwindService } from '@fuse/services/tailwind';
import { AppConfig, Scheme } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';

@Component({
    selector     : 'settings',
    templateUrl  : './settings.component.html',
    styles       : [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy
{
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: [string, any][] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _fuseTailwindService: FuseTailwindService
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
        // Get the themes
        this._fuseTailwindService.tailwindConfig$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.themes = Object.entries(config.themes);
            });

        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                // Store the config
                this.config = config;
            });

        // Set scheme
        if (localStorage.getItem('scheme') === 'light' || !localStorage.getItem('scheme')) {
            this.setScheme('light');
        } else if (localStorage.getItem('scheme') === 'dark') {
            this.setScheme('dark');
        } else {
            this.setScheme('auto');
        }

        // Set layout
        if (localStorage.getItem('layout') === 'classy' || !localStorage.getItem('layout')) {
            this.setLayout('classy');
        } else if (localStorage.getItem('layout') === 'compact') {
            this.setLayout('compact');
        } else {
            this.setLayout('modern');
        }
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
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void
    {
        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams        : {
                layout: null
            },
            queryParamsHandling: 'merge'
        }).then(() => {
            // Set the config
            localStorage.setItem('layout', layout);
            this._fuseConfigService.config = {layout};
        });
    }

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void
    {
        localStorage.setItem('scheme', scheme);
        this._fuseConfigService.config = {scheme};
    }
}
