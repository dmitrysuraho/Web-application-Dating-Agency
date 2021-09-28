import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(private _translateService: TranslateService) {
  }

  ngOnInit(): void {
    AOS.init();
    this._translateService.use('ru'); // TODO: put EN/RU in localStorage
  }

  // @HostBinding('class') componentCssClass: any;
  //
  // onSetTheme(theme: any) {
  //   this._overlayContainer.getContainerElement().classList.add(theme);
  //   this.componentCssClass = theme;
  // }
  // onDeleteTheme(theme: any) {
  //   this._overlayContainer.getContainerElement().classList.remove(theme);
  //   this.componentCssClass = 'default-theme';
  // }
}
