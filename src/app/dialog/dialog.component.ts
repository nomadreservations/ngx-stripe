import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  Element as StripeElement,
  ElementOptions,
  ElementsOptions,
  StripeService
} from '@nomadreservations/ngx-stripe';
import { tap } from 'rxjs/operators';

export interface StripeDialogData {
  key: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  error: any;
  element: StripeElement;
  complete = false;
  token: any = {};
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
    private _dialogRef: MatDialogRef<DialogComponent>,
    private _stripe: StripeService,
    @Inject(MAT_DIALOG_DATA) public data: StripeDialogData
  ) {}

  ngOnInit() {}

  close(): void {
    this._dialogRef.close();
  }

  cardUpdated(result) {
    console.log(result);
    this.element = result.element;
    this.complete = result.complete;
    this.error = undefined;
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
      .pipe(
        tap(result => {
          console.log(result);
        })
      )
      .subscribe(token => {
        this._dialogRef.close(token);
      });
  }
}
