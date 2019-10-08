import { AfterContentInit, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  Element as StripeElement,
  ElementOptions,
  ElementsOptions,
  StripeService
} from '@nomadreservations/ngx-stripe';
import { PaymentRequestButtonStyle, RequestElementOptions } from 'projects/ngx-stripe/src/lib/interfaces/element';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  error: any;
  stripeKey = new FormControl('', [Validators.required, validateStripeTestKey]);
  keyError = 'Must be a valid publishable test key (e.g. beings with pk_test_)';
  complete = false;
  complete2 = false;
  element: StripeElement;
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#276fd3',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  requestOptions: RequestElementOptions = {
    country: 'US',
    currency: 'usd',
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestShipping: true,
    total: {
      amount: 10000,
      label: 'Donate to the things'
    }
  };

  styles: PaymentRequestButtonStyle = {
    type: 'donate',
    theme: 'light',
    height: '64px'
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  public pay = 100;

  token: any = {};

  constructor(private _stripe: StripeService) {
    this.stripeKey.setValue('...');
  }

  ngAfterContentInit() {
    this.keyUpdated();
  }

  cardUpdated(result) {
    console.log(result);
    this.element = result.element;
    this.complete = result.complete;
    this.error = undefined;
  }

  cardUpdated2(result) {
    console.log('update second card', result);
    this.element = result.element;
    this.complete2 = result.complete;
    this.error = undefined;
  }

  keyUpdated() {
    if (this.stripeKey.valid && this.stripeKey.value.length > 0) {
      this._stripe.changeKey(this.stripeKey.value);
    } else if (environment.stripeKey) {
      this._stripe.changeKey(environment.stripeKey);
    }
  }

  updatePay(amount: number) {
    this.pay = amount;
    this.requestOptions = {
      ...this.requestOptions,
      total: {
        ...this.requestOptions.total,
        amount: amount * 100
      }
    };
  }

  requestUpdated(result) {
    console.log('updated token ', result);
    this.token = result;
    // if the server completes payment call this
    result.complete('success');
    // if the server fails to complete payment call this instead
    // result.complete('fail');
  }

  updateShippingAddress(result) {
    console.log('shipping address change', result);
    result.updateWith({
      status: 'success',
      shippingOptions: [
        {
          id: 'free-shipping',
          label: 'Free shipping',
          detail: 'Arrives in 5 to 7 days',
          amount: 0
        },
        {
          id: 'express',
          label: 'Express shipping',
          detail: 'Arrives in 1 to 2 days',
          amount: 1000
        }
      ]
    });
  }
  updateShippingOption(result) {
    console.log('shipping option change', result);
    result.updateWith({
      status: 'success'
    });
  }

  getCardToken() {
    this._stripe
      .createToken(this.element, {
        name: 'tested_ca',
        address_line1: '123 A Place',
        address_line2: 'Suite 100',
        address_city: 'Irving',
        address_state: 'BC',
        address_zip: 'VOE 1H0',
        address_country: 'CA'
      })
      .subscribe(result => {
        this.token = result;
      });
  }
}

function validateStripeTestKey(control: FormControl) {
  if (control.value && control.value.match(/^pk_test_.+/)) {
    return;
  }
  return { valid: false };
}
