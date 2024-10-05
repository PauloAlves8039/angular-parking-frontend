import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { VehicleTableComponent } from './components/vehicle-table/vehicle-table.component';
import { VehicleHomeComponent } from './pages/vehicle-home/vehicle-home.component';
import { VEHICLE_ROUTES } from './vehicle.routing';
import { RouterModule } from '@angular/router';
import { VechicleModalComponent } from './components/vechicle-modal/vechicle-modal.component';

@NgModule({
  declarations: [
    VehicleTableComponent,
    VehicleHomeComponent,
    VechicleModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(VEHICLE_ROUTES)
  ],
  exports: [
    VehicleTableComponent,
    VechicleModalComponent
  ]
})
export class VehicleModule { }
