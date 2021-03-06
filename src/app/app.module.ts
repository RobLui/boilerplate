import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { BdPackagesModule } from './packages.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BdPackagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
