import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHomeComponent } from './pages/customer-home/customer-home.component';
import { CustomerTableComponent } from './components/customer-table/customer-table.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOMER_ROUTES } from './customer.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@NgModule({
  declarations: [
    CustomerTableComponent,
    CustomerHomeComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(CUSTOMER_ROUTES)
  ],
  exports: [
    CustomerTableComponent
  ]
})
export class CustomerModule { }
