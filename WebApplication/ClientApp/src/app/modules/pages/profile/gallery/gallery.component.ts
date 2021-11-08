import { Component, Input } from "@angular/core";
import { User } from "../../../../core/user/user.types";

@Component({
    selector       : 'gallery',
    templateUrl    : './gallery.component.html'
})
export class GalleryComponent
{
    @Input()
    user: User;
}
