import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { VehicleTableComponent } from './components/vehicle-table/vehicle-table.component';
import { VehicleHomeComponent } from './pages/vehicle-home/vehicle-home.component';

@NgModule({
  declarations: [VehicleTableComponent, VehicleHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
  ]
})
export class VehicleModule { }
