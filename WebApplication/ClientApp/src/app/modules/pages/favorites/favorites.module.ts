import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SharedModule } from 'app/shared/shared.module';
import { FavoritesComponent } from "./favorites.component";
import { FavoritePersonComponent } from "./favorite-person/favorite-person.component";
import { FuseCardModule } from "@fuse/components/card";
import { FuseAlertModule } from "@fuse/components/alert";
import { favoritesRoutes } from "./favorites.routing";

@NgModule({
    declarations: [
        FavoritesComponent,
        FavoritePersonComponent
    ],
    imports: [
        RouterModule.forChild(favoritesRoutes),
        SharedModule,
        FuseCardModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        TranslateModule,
        FuseAlertModule
    ]
})
export class FavoritesModule
{
}
