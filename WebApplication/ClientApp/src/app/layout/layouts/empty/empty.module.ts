import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { EmptyLayoutComponent } from 'app/layout/layouts/empty/empty.component';
import { LanguagesModule } from "../../common/languages/languages.module";

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports: [
        RouterModule,
        SharedModule,
        LanguagesModule
    ],
    exports     : [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule
{
}
