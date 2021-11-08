import { Component, Input } from "@angular/core";
import { User } from "../../../../core/user/user.types";
import { UploadService } from "../../../../core/upload/upload.service";

@Component({
    selector       : 'create-post',
    templateUrl    : './create-post.component.html'
})
export class CreatePostComponent
{
    @Input()
    user: User;

    /**
     * Constructor
     */
    constructor(private _upload: UploadService)
    {
    }

    onFileSelected() {
        const inputNode: any = document.querySelector('#file');

        if (typeof (FileReader) !== 'undefined') {
            const reader = new FileReader();

            reader.onload = (event: any) => {
            };

            reader.readAsArrayBuffer(inputNode.files[0]);

            //this._upload.upload(inputNode.files[0])
        }
    }
}
