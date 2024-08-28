import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerVehicleTableComponent } from './components/customer-vehicle-table/customer-vehicle-table.component';
import { CustomerVehicleHomeComponent } from './pages/customer-vehicle-home/customer-vehicle-home.component';
import { CUSTOMER_VEHICLE_ROUTES } from './customer-vehicle.routing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CustomerVehicleTableComponent, CustomerVehicleHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(CUSTOMER_VEHICLE_ROUTES)
  ],
  exports: [
    CustomerVehicleTableComponent
  ]
})
export class CustomerVehicleModule { }
