import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PaymentRequestButtonStyle, RequestElementOptions, UpdateDetails } from './interfaces/element';
import { ElementsOptions } from './interfaces/elements';
import { Source } from './interfaces/sources';
import { ShippingAddress, ShippingOptions, Token } from './interfaces/token';
import { StripeService } from './services/stripe.service';

@Component({
  selector: 'ngx-payment-request',
  template: '<div #request [style.display-none]="hide"></div>'
})
export class PaymentRequestComponent implements OnInit, AfterViewInit {
  @Input()
  private set options(optionsIn: RequestElementOptions) {
    this.options$.next(optionsIn);
  }

  @Input()
  public set elementsOptions(optionsIn: ElementsOptions) {
    this.elementsOptions$.next(optionsIn);
  }

  @Input()
  public set styles(optionsIn: PaymentRequestButtonStyle) {
    this.styles$.next(optionsIn);
  }

  @Input()
  public set complete(success: boolean) {
    this.complete$.next(success);
  }

  constructor(private stripeService: StripeService) {}
  @Output() public change = new EventEmitter<{
    token?: Token;
    paymentMethod?: PaymentMethodData;
    source?: Source;
    complete: (
      status:
        | 'success'
        | 'fail'
        | 'invalid_payer_name'
        | 'invalid_payer_phone'
        | 'invalid_payer_email'
        | 'invalid_shipping_address'
    ) => {};
    payerName?: string;
    payerEmail?: string;
    payerPhone?: string;
    shippingAddress?: ShippingAddress;
    shippingOption?: ShippingOptions;
    methodName?: string;
  }>();
  @Output() public shippingAddressChange = new EventEmitter<{
    updateWith: (updateDetails: UpdateDetails) => {};
    shippingAddress: ShippingAddress;
  }>();
  @Output() public shippingOptionChange = new EventEmitter<{
    updateWith: (updateDetails: UpdateDetails) => {};
    shippingOption: ShippingOptions;
  }>();
  @Output() public cancel = new EventEmitter<any>();

  public hide = false;

  @ViewChild('request', { static: false }) private requestButton?: ElementRef;
  private styles$ = new BehaviorSubject<PaymentRequestButtonStyle>({});
  private options$ = new ReplaySubject<RequestElementOptions>();
  private elementsOptions$ = new BehaviorSubject<ElementsOptions>({});
  private lastEvent: any;
  private complete$ = new Subject<boolean>();
  private _attached = false;
  private _opened = false;
  private _paymentRequest: any;

  private elements$: Observable<any>;
  private request$: Observable<any>;

  ngOnInit() {
    this.elements$ = this.elementsOptions$.asObservable().pipe(
      switchMap(options => {
        return this.stripeService.elements(options);
      })
    );
    this.request$ = this.options$.asObservable().pipe(
      switchMap(options => {
        return this.stripeService.paymentRequest(options);
      })
    );

    this.complete$.subscribe(complete => {
      if (this.lastEvent) {
        if (complete) {
          this.lastEvent.complete('success');
        } else {
          this.lastEvent.complete('fail');
        }
      }
    });
  }
  ngAfterViewInit(): void {
    combineLatest(this.request$, this.elements$, this.options$, this.styles$).subscribe(
      ([paymentRequest, elements, options, styles]) => {
        if (this.requestButton && !this._attached) {
          this._paymentRequest = paymentRequest;
          this._attached = true;
          const element = elements.create('paymentRequestButton', {
            paymentRequest,
            style: {
              paymentRequestButton: { ...styles }
            }
          });

          this.hide = false;
          paymentRequest.canMakePayment().then(result => {
            if (result) {
              element.mount(this.requestButton.nativeElement);
            } else {
              this.hide = true;
            }
          });
          paymentRequest.on('shippingaddresschange', event => {
            this.shippingAddressChange.emit(event);
          });
          paymentRequest.on('shippingoptionchange', event => {
            this.shippingOptionChange.emit(event);
          });
          paymentRequest.on('token', event => {
            this.change.emit(event);
            this._opened = false;
          });
          paymentRequest.on('paymentmethod', event => {
            this.change.emit(event);
          });
          paymentRequest.on('source', event => {
            this.change.emit(event);
          });
          paymentRequest.on('cancel', event => {
            this.cancel.emit(event);
            this._opened = false;
          });
          paymentRequest.on('click', () => {
            this._opened = true;
          });
        } else if (this._attached && !this._opened) {
          this._paymentRequest.update({
            currency: options.currency,
            total: options.total,
            displayItems: options.displayItems,
            shippingOptions: options.shippingOptions
          });
        }
      }
    );
  }
}
