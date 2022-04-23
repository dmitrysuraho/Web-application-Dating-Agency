import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input"
import { SharedModule } from 'app/shared/shared.module';
import { NewsComponent } from "./news.component";
import { FuseCardModule } from "@fuse/components/card";
import { FuseAlertModule } from "@fuse/components/alert";
import { PostNewsComponent } from "./post-news/post-news.component";
import { newsRoutes } from "./news.routing";;

@NgModule({
    declarations: [
        NewsComponent,
        PostNewsComponent
    ],
    imports: [
        RouterModule.forChild(newsRoutes),
        SharedModule,
        FuseCardModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslateModule,
        FuseAlertModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class NewsModule
{
}
