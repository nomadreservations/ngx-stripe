import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';

@Injectable()
export class DocumentRef {
  constructor(
    private _platform: PlatformService
  ) {}

  public getNativeDocument(): Document {
    if (this._platform.isBrowser) {
      return document;
    }
    return {} as Document;
  }
}
