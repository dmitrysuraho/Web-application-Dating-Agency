import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru-BY";
import localeEn from "@angular/common/locales/en-GB";
import { takeUntil} from "rxjs/operators";
import { Subject } from "rxjs";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { ChatService } from "./chat.service";
import { Chat } from "./chat.types";

@Component({
    selector       : 'chat',
    templateUrl    : './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy
{
    chats: Chat[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _splashScreen: FuseSplashScreenService,
        private _chatService: ChatService,
        private _activatedRoute: ActivatedRoute)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Register locale data
        registerLocaleData(localeRu);
        registerLocaleData(localeEn);

        // Show spinner
        this._splashScreen.show();

        // Reset chat
        this._chatService.resetChat();

        // Get chats
        this._chatService.getChats()
            .pipe(
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((chats: Chat[]) => {
                this.chats = chats;
                this._splashScreen.hide();
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
