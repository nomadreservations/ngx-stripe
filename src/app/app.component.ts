import { AfterContentInit, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Element as StripeElement, ElementOptions, ElementsOptions, StripeService } from '@nomadreservations/ngx-stripe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentInit {
  error: any;
  stripeKey = new FormControl('', [
    Validators.required,
    validateStripeTestKey
  ]);
  keyError = 'Must be a valid publishable test key (e.g. beings with pk_test_)';
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

  token: any = {};

  constructor(
    private _stripe: StripeService
  ) {}

  ngAfterContentInit() {
    this.keyUpdated();
  }

  cardUpdated(result) {
    console.log(result);
    this.element = result.element;
    this.complete = result.card.complete;
    this.error = undefined;
  }

  keyUpdated() {
    if (this.stripeKey.valid && this.stripeKey.value.length > 0) {
      this._stripe.changeKey(this.stripeKey.value);
    } else if (environment.stripeKey) {
      this._stripe.changeKey(environment.stripeKey);
    }
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
      this.token = result;
    });
  }
}

function validateStripeTestKey(control: FormControl) {
  if (control.value && control.value.match(/^pk_test_.+/)) {
    return;
  }
  return {valid: false};
}
