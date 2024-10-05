import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressTableComponent } from './components/address-table/address-table.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ADDRESS_ROUTES } from './address.routing';
import { SharedModule } from '../../shared/shared.module';
import { AddressHomeComponent } from './pages/address-home/address-home.component';
import { AddressModalComponent } from './components/address-modal/address-modal.component';

@NgModule({
  declarations: [
    AddressTableComponent,
    AddressHomeComponent,
    AddressModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forChild(ADDRESS_ROUTES)
  ],
  exports: [
    AddressTableComponent,
    AddressModalComponent
  ]
})
export class AddressModule { }
