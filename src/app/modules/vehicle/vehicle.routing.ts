import { Routes, RouterModule } from '@angular/router';
import { VehicleHomeComponent } from './pages/vehicle-home/vehicle-home.component';

export const VEHICLE_ROUTES: Routes = [
  {
    path: '',
    component: VehicleHomeComponent,
  }
];
