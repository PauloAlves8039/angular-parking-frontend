import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STAY_ROUTES } from './stay.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StayTableComponent } from './components/stay-table/stay-table.component';
import { StayHomeComponent } from './pages/stay-home/stay-home.component';

@NgModule({
  declarations: [StayTableComponent, StayHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(STAY_ROUTES)
  ],
  exports: [
    StayTableComponent
  ]
})
export class StayModule { }
