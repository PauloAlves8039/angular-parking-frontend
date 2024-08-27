import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
import { AddressModule } from './modules/address/address.module';
import { CustomerModule } from './modules/customer/customer.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { CustomerVehicleModule } from './modules/customer-vehicle/customer-vehicle.module';
import { StayModule } from './modules/stay/stay.module';

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
    AddressModule,
    CustomerModule,
    VehicleModule,
    CustomerVehicleModule,
    StayModule,
  ],
  providers: [{ provide: 'BASE_API_URL', useValue: 'https://localhost:7199/api'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
