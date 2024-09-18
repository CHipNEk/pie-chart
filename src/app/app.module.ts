import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LuckyWheelComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LuckyWheelComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [LuckyWheelComponent]
})
export class AppModule { }
