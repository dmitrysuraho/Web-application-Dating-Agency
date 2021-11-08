import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from "@ngx-translate/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from "@fuse/components/alert";
import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileComponent } from 'app/modules/pages/profile/profile.component';
import { InfoComponent } from "./info/info.component";
import { DescriptionComponent } from "./description/description.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { CreatePostComponent } from "./create-post/create-post.component";
import { profileRoutes } from 'app/modules/pages/profile/profile.routing';

@NgModule({
    declarations: [
        ProfileComponent,
        InfoComponent,
        DescriptionComponent,
        GalleryComponent,
        CreatePostComponent
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
        FuseAlertModule
    ]
})
export class ProfileModule
{
}
