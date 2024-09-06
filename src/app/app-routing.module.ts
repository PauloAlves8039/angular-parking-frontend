import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuard } from './modules/auth/guards/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'address',
    loadChildren: () => import('./modules/address/address.module').then(m => m.AddressModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./modules/customer/customer.module').then(m => m.CustomerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehicle',
    loadChildren: () => import('./modules/vehicle/vehicle.module').then(m => m.VehicleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-vehicle',
    loadChildren: () => import('./modules/customer-vehicle/customer-vehicle.module').then(m => m.CustomerVehicleModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'stay',
    loadChildren: () => import('./modules/stay/stay.module').then(m => m.StayModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
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
