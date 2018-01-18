import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule } from '@angular/material';

import { NgxStripeModule } from '@nomadreservations/ngx-stripe';


import { AppComponent } from './app.component';
import 'rxjs/add/operator/publishLast';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
