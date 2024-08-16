import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { AddressModule } from './modules/address/address.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HomeModule,
    SharedModule,
    AddressModule
  ],
  providers: [{ provide: 'BASE_API_URL', useValue: 'https://localhost:7199/api'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
