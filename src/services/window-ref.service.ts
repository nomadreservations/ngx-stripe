import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';

@Injectable()
export class WindowRef {
  constructor(
    private _platform: PlatformService
  ) {}

  public getNativeWindow(): Window {
    if (this._platform.isBrowser) {
      return window;
    }
    return {} as Window;
  }
}
