import { NgModule, ModuleWithProviders } from '@angular/core';

import { LazyStripeAPILoader } from './services/api-loader.service';
import { StripeService } from './services/stripe.service';

import { WindowRef } from './services/window-ref.service';
import { DocumentRef } from './services/document-ref.service';
import { PlatformService } from './services/platform.service';

import { Options, STRIPE_PUBLISHABLE_KEY, STRIPE_OPTIONS } from './interfaces/stripe';
import { StripeCardComponent } from './stripe-card.component';











export interface NgxStripeModuleOptions {
  publishableKey?: string;
  options?: Options;
}

@NgModule({
  declarations: [StripeCardComponent],
  exports: [StripeCardComponent]
})
export class NgxStripeModule {
  public static forRoot( publishableKey: string, options?: Options ): ModuleWithProviders {
    return {
      ngModule: NgxStripeModule,
      providers: [
        LazyStripeAPILoader,
        StripeService,
        PlatformService,
        WindowRef,
        DocumentRef,
        {
          provide: STRIPE_PUBLISHABLE_KEY,
          useValue: publishableKey
        },
        {
          provide: STRIPE_OPTIONS,
          useValue: options
        }
      ]
    };
  }
}
