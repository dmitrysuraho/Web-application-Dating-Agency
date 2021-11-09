import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatingComponent } from "./dating.component";
import { datingRoutes } from "./dating.routing";

@NgModule({
    declarations: [
        DatingComponent
    ],
    imports: [
        RouterModule.forChild(datingRoutes)
    ]
})
export class DatingModule
{
}
