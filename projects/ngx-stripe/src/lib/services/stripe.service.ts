import { Inject, Injectable } from '@angular/core';
import { from as observableFrom, Observable, ReplaySubject } from 'rxjs';
import { filter, map, publishLast, refCount, take } from 'rxjs/operators';
import { Element } from '../interfaces/element';
import { Elements, ElementsOptions } from '../interfaces/elements';
import { isSourceData, SourceData, SourceParams, SourceResult } from '../interfaces/sources';
import { Options, StripeJS, STRIPE_OPTIONS, STRIPE_PUBLISHABLE_KEY } from '../interfaces/stripe';
import { BankAccount, BankAccountData, CardDataOptions, isBankAccount, isBankAccountData, isPii, isPiiData, Pii, PiiData, TokenResult } from '../interfaces/token';
import { LazyStripeAPILoader, Status } from './api-loader.service';
import { PlatformService } from './platform.service';
import { WindowRef } from './window-ref.service';

@Injectable()
export class StripeService {
  public stripeChanged$: ReplaySubject<StripeJS> = new ReplaySubject();
  private stripe: StripeJS = {} as StripeJS;

  constructor(
    @Inject(STRIPE_PUBLISHABLE_KEY) private key: string,
    @Inject(STRIPE_OPTIONS) private options: Options,
    private loader: LazyStripeAPILoader,
    private window: WindowRef,
    private _platform: PlatformService
  ) {
    this.changeKey(this.key, this.options)
      .pipe(take(1))
      .subscribe(() => {});
  }

  public changeKey(
    key: string,
    options?: Options
  ): Observable<StripeJS | undefined> {
    const obs = this.loader.asStream().pipe(
      filter((status: Status) => status.loaded === true),
      map(() => {
        if (!this.window.getNativeWindow()) {
          return;
        }
        const Stripe = (this.window.getNativeWindow() as any).Stripe;
        if (key) {
          this.stripe = options
            ? (Stripe(key, options) as StripeJS)
            : (Stripe(key) as StripeJS);
          this.stripeChanged$.next(this.stripe);
        }
        return this.stripe;
      }),
      publishLast(),
      refCount()
    );
    obs.subscribe();
    return obs;
  }

  public elements(options?: ElementsOptions): Observable<Elements> {
    return this.stripeChanged$.pipe(map(() => this.stripe.elements(options)));
  }

  public createToken(
    a: Element | BankAccount | Pii,
    b: CardDataOptions | BankAccountData | PiiData | undefined
  ): Observable<TokenResult> {
    if (isBankAccount(a) && isBankAccountData(b)) {
      return observableFrom(this.stripe.createToken(a, b));
    } else if (isPii(a) && isPiiData(b)) {
      return observableFrom(this.stripe.createToken(a, b));
    } else {
      return observableFrom(
        this.stripe.createToken(a as Element, b as CardDataOptions | undefined)
      );
    }
  }

  public createSource(
    a: Element | SourceData,
    b?: SourceData | undefined
  ): Observable<SourceResult> {
    if (isSourceData(a)) {
      return observableFrom(this.stripe.createSource(a as SourceData));
    }
    return observableFrom(this.stripe.createSource(a as Element, b));
  }

  public retrieveSource(source: SourceParams): Observable<SourceResult> {
    return observableFrom(this.stripe.retrieveSource(source));
  }
}
