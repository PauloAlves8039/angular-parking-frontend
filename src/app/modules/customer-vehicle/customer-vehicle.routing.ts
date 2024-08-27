import { Routes, RouterModule } from '@angular/router';
import { CustomerVehicleHomeComponent } from './page/customer-vehicle-home/customer-vehicle-home.component';

export const CUSTOMER_VEHICLE_ROUTES: Routes = [
  {
    path: '',
    component: CustomerVehicleHomeComponent,
  }
];