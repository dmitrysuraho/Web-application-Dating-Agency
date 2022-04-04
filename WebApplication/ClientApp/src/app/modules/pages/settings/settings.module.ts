import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from "@angular/material/menu";
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { SettingsComponent } from 'app/modules/pages/settings/settings.component';
import { SettingsAccountComponent } from 'app/modules/pages/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/modules/pages/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/modules/pages/settings/plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from 'app/modules/pages/settings/notifications/notifications.component';
import { SettingsBlacklistComponent } from "./blacklist/blacklist.component";
import { SettingsAppearanceComponent } from 'app/modules/pages/settings/appearance/appearance.component';
import { BlockedUserComponent } from "./blacklist/blocked-user/blocked-user.component";
import { settingsRoutes } from 'app/modules/pages/settings/settings.routing';
import { PaypalDialogComponent } from "./plan-billing/paypal-dialog/paypal-dialog.component";

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        PaypalDialogComponent,
        SettingsNotificationsComponent,
        SettingsBlacklistComponent,
        SettingsAppearanceComponent,
        BlockedUserComponent
    ],
    imports: [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
        TranslateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatDialogModule
    ]
})
export class SettingsModule
{
}
