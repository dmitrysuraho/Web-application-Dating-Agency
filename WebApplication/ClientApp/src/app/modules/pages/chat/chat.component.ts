import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import localeRu from "@angular/common/locales/ru-BY";
import localeEn from "@angular/common/locales/en-GB";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
import { ChatService } from "./chat.service";
import { Chat } from "./chat.types";
import { Navigation } from "../../../core/navigation/navigation.types";
import { NavigationService } from "../../../core/navigation/navigation.service";
import { CalendarService } from "../calendar/calendar.service";

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
        private _activatedRoute: ActivatedRoute,
        private _navigationService: NavigationService,
        private _calendarService: CalendarService,
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
                this.chats = chats.filter((chat: Chat) => chat?.lastMessage)
                    .sort(function(a,b) {
                        if (a.lastMessage.createdAt > b.lastMessage.createdAt) {
                            return -1;
                        }
                        if (a.lastMessage.createdAt < b.lastMessage.createdAt) {
                            return 1;
                        }
                        return 0;
                    });

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
