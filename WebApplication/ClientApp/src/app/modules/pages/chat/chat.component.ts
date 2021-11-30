import { Component, OnInit } from '@angular/core';
import { FuseSplashScreenService } from "@fuse/services/splash-screen";

@Component({
    selector       : 'chat',
    templateUrl    : './chat.component.html'
})
export class ChatComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(private _splashScreen: FuseSplashScreenService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Splash screen
        this._splashScreen.show();
        setTimeout(() => this._splashScreen.hide(), 1000);
    }
}
