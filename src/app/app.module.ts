import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxStripeModule } from '@nomadreservations/ngx-stripe';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

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
