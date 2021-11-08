import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { Error404Component } from 'app/modules/error/error-404/error-404.component';
import { LanguagesModule } from "../../../layout/common/languages/languages.module";
import { error404Routes } from 'app/modules/error/error-404/error-404.routing';

@NgModule({
    declarations: [
        Error404Component
    ],
    imports: [
        RouterModule.forChild(error404Routes),
        TranslateModule,
        LanguagesModule
    ]
})
export class Error404Module
{
}
