<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [@nomadreservations/ngx-stripe](#nomadreservationsngx-stripe)
  - [Features](#features)
  - [Installation](#installation)
  - [Using the library](#using-the-library)
  - [StripeCardComponent](#stripecardcomponent)
    - [RequestPaymentButton](#requestpaymentbutton)
    - [Dynamic Stripe Keys](#dynamic-stripe-keys)
    - [PaymentIntents](#paymentintents)
    - [SCA/3D Secure payments](#sca3d-secure-payments)
  - [Testing](#testing)
  - [Building](#building)
  - [Publishing](#publishing)
  - [Documentation](#documentation)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# @nomadreservations/ngx-stripe

[![version](https://img.shields.io/npm/v/@nomadreservations/ngx-stripe.svg)](https://www.npmjs.com/package/@nomadreservations/ngx-stripe)
[![license](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/@nomadreservations/ngx-stripe)

@angular wrapper for StripeJS based on module by Ricardo Sánchez Gregorio at https://github.com/richnologies/ngx-stripe

_Note: This version is designed to work with angular v8+ only_

## Features

* Stripe Service
* Lazy script loading
* AoT compliant
* SSR fallback

## Installation

To install this library, run:

```bash
$ npm install @nomadreservations/ngx-stripe --save
or
$ yarn add @nomadreservations/ngx-stripe
```

## Using the library

Import the `NgxStripeModule` into the application

The module takes the same parameters as the global Stripe object. The APIKey and the optional options to use Stripe connect

* apiKey: string
* options: {
  stripeAccount?: string;
}

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { NgxStripeModule } from '@nomadreservations/ngx-stripe';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxStripeModule.forRoot('***your-stripe-publishable key***'),
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

_Note: If you leave the publishable key blank you must set on using StripeSerive.changeKey prior to creating token's or sources_

## StripeCardComponent

As an alternative to the previous example, you could use the StripeCardComponent.

It will make a little bit easier to mount the card.

To fetch the Stripe Element, you could you use either the (change) output, or,
by using a ViewChild, the public method getCard()

//stripe.compnent.html
```html
<ngx-stripe-card [options]="cardOptions" [elementsOptions]="elementsOptions" (change)="cardUpdated($event)" (error)="error = $event"></ngx-stripe-card>
<div class="error">
  {{error?.message}}
</div>
<button (click)="getCardToken()" [disabled]="!complete">Get Card Token</button>
```

//stripe.component.ts
```typescript
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "@nomadreservations/ngx-stripe";


@Component({
  selector: 'app-stripe-test',
  templateUrl: 'stripe.component.html'
})
export class StripeTestComponent implements OnInit {
  stripeKey = '';
  error: any;
  complete = false;
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

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  constructor(
    private _stripe: StripeService
  ) {}

  cardUpdated(result) {
    this.element = result.element;
    this.complete = result.card.complete;
    this.error = undefined;
  }

  keyUpdated() {
    this._stripe.changeKey(this.stripeKey);
  }

  getCardToken() {
    this._stripe.createToken(this.element, {
      name: 'tested_ca',
      address_line1: '123 A Place',
      address_line2: 'Suite 100',
      address_city: 'Irving',
      address_state: 'BC',
      address_zip: 'VOE 1H0',
      address_country: 'CA'
    }).subscribe(result => {
      // Pass token to service for purchase.
      console.log(result);
    });
  }
}
```

### RequestPaymentButton
A payment request button (e.g. apple pay, google chrome payment, etc.) can be enabled with the `ngx-payment-request` component. All of the options [Request Payment Api](https://stripe.com/docs/payment-request-api) options are exposed via the three options sections in the component. 

// request-button.component.html
```html
<div class="container">
  <mat-card>
    Pay: <mat-slider min="1" max="100" step="10" thumbLabel [value]="pay" (valueChange)="updatePay($event)"></mat-slider>
    <ngx-payment-request 
      [options]="requestOptions" 
      [elementsOptions]="elementsOptions" 
      [styles]="styles" 
      (shippingAddressChange)="updateShippingAddress($event)"
      (shippingOptionChange)="updateShippingOption($event)"
      (change)="requestUpdated($event)">
    </ngx-payment-request>

  </mat-card>
```

// request-button.compnent.ts
```typescript
@Component({
  selector: 'app-test',
  templateUrl: 'request-button.component.html'
})
export class RequestButtonComponent implements OnInit {
  @Input set stripeKey(key) {
    this._stripe.changeKey(key);
  }

  public requestOptions: RequestElementOptions = {
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

  public styles: PaymentRequestButtonStyle = {
    type: 'donate',
    theme: 'light',
    height: '64px'
  };

  public elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  public pay = 100;

  constructor(private _stripe: StripeService) { }
  
  public updatePay(amount: number) {
    this.pay = amount;
    this.requestOptions = {
      ...this.requestOptions,
      total: {
        ...this.requestOptions.total,
        amount: amount * 100
      }
    };
  }

  public async requestUpdated(result) {
    const response = await fetch('/charges', {
      method: 'POST',
      body: JSON.stringify({token: result.token.id}),
      headers: {'content-type': 'application/json'},
    });

    if (response.ok) {
      result.complete('success');
    } else {
      result.complete('fail');
    }    
  }

  public updateShippingAddress(result) {
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

  public updateShippingOption(result) {
    result.updateWith({
      status: 'success'
    });
  }
}

```

### Dynamic Stripe Keys
Given the way an AOT angular build processes provided values if you need to provide a stripe key at runtime you'll want to forgo the forRoot initialization and instead add a factory and provider

```ts

  export function NgxStripeFactory(): string {
    return dynamicLocation.stripePkKey;
  }
  
  @NgModule({
    ...
    imports: []
      ...
      NgxStripeModule.forRoot('whatever key you think should be default'),
      ...
    ]
    providers: [
      {
        provide: STRIPE_PUBLISHABLE_KEY,
        useFactory: NgxStripeFactory
      }
    ]
  })
```

### PaymentIntents
You can use the payment intents api with this service just like with stripe.js the following are exposed via the `StripeService`

```ts
  handleCardSetup(clientSecret: string, el: Element, cardSetupOptions?: SetupIntentData): Promise<SetupIntentResult>;
  handleCardAction(clientSecret: string);
  handleCardPayment(clientSecret: string, el: Element, data: CardPaymentData);
  confirmPaymentIntent(clientSecret: string, el: Element, data: ConfirmIntentData);
  retrievePaymentIntent(clientSecret: string);
  confirmSetupIntent(clientSecret: string, el: Element, data: ConfirmSetupIntentData);
  retrieveSetupIntent(clientSecret: string);
```

### SCA/3D Secure payments

3D Secure payments are enabled by following a [3D Secure Flow](https://stripe.com/docs/payments/3d-secure#example-of-a-3d-secure-2-flow) using the payment intents api's. You will need to setup a proper next action in the payment intent based off of the 3D Secure response from the customers bank/institution. 

Example:
//stripe.compnent.html
```html
<ngx-stripe-card [options]="cardOptions" [elementsOptions]="elementsOptions" (change)="cardUpdated($event)" (error)="error = $event"></ngx-stripe-card>
<div class="error">
  {{error?.message}}
</div>
<button (click)="payNow()" [disabled]="!complete">Pay</button>
```

//stripe.component.ts
```typescript
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "@nomadreservations/ngx-stripe";


@Component({
  selector: 'app-stripe-test',
  templateUrl: 'stripe.component.html'
})
export class StripeTestComponent implements OnInit {
  stripeKey = '';
  error: any;
  complete = false;
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

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  constructor(
    private _stripe: StripeService
  ) {}

  cardUpdated(result) {
    this.element = result.element;
    this.complete = result.card.complete;
    if(this.complete) {
      this._stripe.
    }
    this.error = undefined;
  }

  keyUpdated() {
    this._stripe.changeKey(this.stripeKey);
  }

  async payNow() {
    const response = await fetch('/paymentIntent', {
      method: 'POST',
      body: JSON.stringify({amount: 10000, currency: 'usd'}),
      headers: {'content-type': 'application/json'},
    });

    const body = await response.json();
    this._stripe.handleCardPayment(body.client_secret, this.element, { payment_method_data: {
      billing_details: {name: 'Bob Smith'}
    }}).subscribe(result => {
      if(result.error) {
        console.error('got stripe error', result.error);
      } else {
        console.log('payment succeeded');
      }
    });
  }
}
```

Please note you can also manually handle this flow using the paymentIntent methods however that is not the default path and you will have to implement it yourself (see more [here](https://stripe.com/docs/payments/3d-secure))

## Testing
The following command runs unit & integration tests that are in the `tests` folder, and unit tests that are in `src` folder:
```Shell
yarn test
```

## Building
The following command:
```Shell
yarn build
```
- starts _TSLint_ with _Codelyzer_
- starts _AoT compilation_ using _ngc_ compiler
- creates `dist` folder with all the files of distribution

To test the npm package locally, use the following command:
```Shell
yarn publish:dev
```
You can then run the following to install it in an app to test it:
```Shell
yalc link @nomadreservations/ngx-stripe
```

## Publishing

```Shell
yarn release:patch
or
yarn release:minor
or
yarn release:major
```

## Documentation
To generate the documentation, this starter uses [compodoc](https://github.com/compodoc/compodoc):
```Shell
yarn compodoc
yarn compodoc:serve
```

## License

MIT
