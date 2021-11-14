import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FuseCardModule } from "@fuse/components/card";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { DatingComponent } from "./dating.component";
import { PersonCardComponent } from "./person-card/person-card.component";
import { datingRoutes } from "./dating.routing";

@NgModule({
    declarations: [
        DatingComponent,
        PersonCardComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(datingRoutes),
        FuseCardModule,
        CarouselModule,
        MatButtonModule,
        MatIconModule
    ]
})
export class DatingModule
{
}
