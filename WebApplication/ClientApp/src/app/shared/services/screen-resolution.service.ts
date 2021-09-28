import {Injectable} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {ReplaySubject} from 'rxjs';

import {ScreenSize} from '../enums/screen-size.enum';

@Injectable()
export class ScreenResolutionService {
  public resolutionChanged = new ReplaySubject<ScreenSize>(1);

  get screenSize(): ScreenSize {
    return this._currentState;
  }

  get isXSmall(): boolean {
    return this._isXSmall;
  }

  get isSmall(): boolean {
    return this._isSmall;
  }

  get isMedium(): boolean {
    return this._isMedium;
  }

  get isLarge(): boolean {
    return this._isLarge;
  }

  private _currentState: ScreenSize;
  private _isXSmall: boolean;
  private _isSmall: boolean;
  private _isMedium: boolean;
  private _isLarge: boolean;

  private readonly XSmall = '(max-width: 599px)';
  private readonly Small = '(min-width: 600px) and (max-width: 959px)';
  private readonly Medium = '(min-width: 960px) and (max-width: 1279px)';
  private readonly Large = '(min-width: 1280px)';

  constructor(private _breakpointObserver: BreakpointObserver) {
    this._initCurrentState();
    this._breakpointObserver.observe([
      this.XSmall,
      this.Small,
      this.Medium,
      this.Large
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this._isXSmall = false;
        this._isSmall = false;
        this._isMedium = false;
        this._isLarge = false;

        if (result.breakpoints[this.XSmall]) {
          this._currentState = ScreenSize.XSmall;
          this._isXSmall = true;
        } else if (result.breakpoints[this.Small]) {
          this._currentState = ScreenSize.Small;
          this._isSmall = true;
        } else if (result.breakpoints[this.Medium]) {
          this._currentState = ScreenSize.Medium;
          this._isMedium = true;
        } else {
          this._currentState = ScreenSize.Large;
          this._isLarge = true;
        }
        this.resolutionChanged.next(this._currentState);
      }
    });
  }

  public getCurrentState(): ScreenSize {
    return this._currentState;
  }

  private _initCurrentState() {
    if (window.matchMedia(this.XSmall).matches) {
      this._currentState = ScreenSize.XSmall;
    } else if (window.matchMedia(this.Small).matches) {
      this._currentState = ScreenSize.Small;
    } else if (window.matchMedia(this.Medium).matches) {
      this._currentState = ScreenSize.Medium;
    } else {
      this._currentState = ScreenSize.Large;
    }
  }
}
