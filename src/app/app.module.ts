import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatSliderModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from '@nomadreservations/ngx-stripe';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [AppComponent, DialogComponent],
  entryComponents: [DialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatSliderModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot('')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
