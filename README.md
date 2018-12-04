<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [@nomadreservations/ngx-stripe](#nomadreservationsngx-stripe)
  - [Features](#features)
  - [Installation](#installation)
  - [Using the library](#using-the-library)
  - [StripeCardComponent](#stripecardcomponent)
  - [Testing](#testing)
  - [Building](#building)
  - [Publishing](#publishing)
  - [Documentation](#documentation)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# @nomadreservations/ngx-stripe

[![version](https://img.shields.io/npm/v/ngx-stripe.svg)](https://www.npmjs.com/package/@nomadreservations/ngx-stripe)
[![license](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/@nomadreservations/ngx-stripe)

@angular wrapper for StripeJS based on module by Ricardo Sánchez Gregorio at https://github.com/richnologies/ngx-stripe

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
```xml
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
