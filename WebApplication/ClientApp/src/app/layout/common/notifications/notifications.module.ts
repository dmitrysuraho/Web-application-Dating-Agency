import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        NotificationsComponent
    ],
    imports: [
        RouterModule,
        OverlayModule,
        PortalModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        SharedModule,
        TranslateModule,
        MatProgressSpinnerModule
    ],
    exports     : [
        NotificationsComponent
    ]
})
export class NotificationsModule
{
}
