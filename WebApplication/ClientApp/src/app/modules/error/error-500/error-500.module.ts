import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { Error500Component } from 'app/modules/error/error-500/error-500.component';
import { LanguagesModule } from "../../../layout/common/languages/languages.module";
import { error500Routes } from 'app/modules/error/error-500/error-500.routing';

@NgModule({
    declarations: [
        Error500Component
    ],
    imports: [
        RouterModule.forChild(error500Routes),
        TranslateModule,
        LanguagesModule
    ]
})
export class Error500Module
{
}
