import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FuseAlertModule } from "@fuse/components/alert";
import { SharedModule } from 'app/shared/shared.module';
import { chatRoutes } from './chat.routing';
import { ChatComponent } from './chat.component';
import { ChatsComponent } from './chats/chats.component';
import { ConversationComponent } from './conversation/conversation.component';
import { AttachmentsDialogComponent } from './attachments-dialog/attachments-dialog.component';
import { CallDialogComponent } from './call-dialog/call-dialog.component';

@NgModule({
    declarations: [
        ChatComponent,
        ChatsComponent,
        ConversationComponent,
        AttachmentsDialogComponent,
        CallDialogComponent
    ],
    imports: [
        RouterModule.forChild(chatRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSidenavModule,
        SharedModule,
        MatProgressSpinnerModule,
        TranslateModule,
        FuseAlertModule,
        CarouselModule,
        MatDialogModule
    ]
})
export class ChatModule
{
}
