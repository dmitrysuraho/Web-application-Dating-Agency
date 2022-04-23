import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CarouselModule } from "ngx-bootstrap/carousel";
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from "@angular/material/dialog";
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileComponent } from 'app/modules/pages/profile/profile.component';
import { InfoComponent } from './info/info.component';
import { DescriptionComponent } from './description/description.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { GalleryComponent } from './gallery/gallery.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './posts/post/post.component';
import { GalleryDialogComponent } from './gallery/gallery-dialog/gallery-dialog.component';
import { profileRoutes } from 'app/modules/pages/profile/profile.routing';

@NgModule({
    declarations: [
        ProfileComponent,
        InfoComponent,
        DescriptionComponent,
        FavoritesComponent,
        GalleryComponent,
        PostsComponent,
        PostComponent,
        GalleryDialogComponent
    ],
    imports: [
        RouterModule.forChild(profileRoutes),
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        FuseCardModule,
        SharedModule,
        TranslateModule,
        FuseSplashScreenModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
        MatDialogModule,
        CarouselModule
    ]
})
export class ProfileModule
{
}
