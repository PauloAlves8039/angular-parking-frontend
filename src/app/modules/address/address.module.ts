import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressTableComponent } from './components/address-table/address-table.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ADDRESS_ROUTES } from './address.routing';
import { SharedModule } from '../../shared/shared.module';
import { AddressHomeComponent } from './page/address-home/address-home.component';

@NgModule({
  declarations: [AddressTableComponent, AddressHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(ADDRESS_ROUTES)
  ],
  exports: [
    AddressTableComponent
  ]
})
export class AddressModule { }
