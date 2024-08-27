import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'address',
    loadChildren: () => import('./modules/address/address.module').then(m => m.AddressModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'vehicle',
    loadChildren: () => import('./modules/vehicle/vehicle.module').then(m => m.VehicleModule)
  },
  {
    path: 'customer-vehicle',
    loadChildren: () => import('./modules/customer-vehicle/customer-vehicle.module').then(m => m.CustomerVehicleModule)
  },
  {
    path: 'stay',
    loadChildren: () => import('./modules/stay/stay.module').then(m => m.StayModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
