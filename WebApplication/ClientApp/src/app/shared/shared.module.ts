import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDialogModule } from './report-dialog/report-dialog.module';
import { QuestionDialogModule } from './question-dialog/question-dialog.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ReportDialogModule,
        QuestionDialogModule
    ]
})
export class SharedModule
{
}
