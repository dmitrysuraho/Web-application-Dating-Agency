import {Component, HostBinding, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {OverlayContainer} from "@angular/cdk/overlay";
import {HttpClient} from "@angular/common/http";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(private _translateService: TranslateService,
              private _overlayContainer: OverlayContainer,
              private _httpClient: HttpClient) {
  }

  dataSource: any;
  displayedColumns: string[] = ['Name', 'Phone'];

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker'
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {
    this._translateService.use('ru');
    AOS.init();

    this._httpClient.get('/api/test')
      .subscribe((items: any) => {
        this.dataSource = items
      })
  }

  @HostBinding('class') componentCssClass: any;

  onSetTheme(theme: any) {
    this._overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
