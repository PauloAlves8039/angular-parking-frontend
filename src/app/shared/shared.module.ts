import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BaseTableComponent } from './components/base-table/base-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RealPipe } from './pipes/currencies/real/real.pipe';
import { CpfmaskPipe } from './pipes/input-format/cpf/cpfmask.pipe';
import { DatehourPipe } from './pipes/basic-date-format/date-hour/datehour.pipe';
import { DateformatPipe } from './pipes/basic-date-format/date/dateformat.pipe';
import { ZipcodeformatPipe } from './pipes/input-format/zipcode/zipcodeformat.pipe';
import { PhoneformatPipe } from './pipes/input-format/phone/phoneformat.pipe';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    BaseTableComponent,
    PaginationComponent,
    RealPipe,
    DateformatPipe,
    DatehourPipe,
    CpfmaskPipe,
    PhoneformatPipe,
    ZipcodeformatPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    BaseTableComponent,
    PaginationComponent,
    RealPipe,
    DateformatPipe,
    DatehourPipe,
    CpfmaskPipe,
    ZipcodeformatPipe,
    PhoneformatPipe,

  ]
})
export class SharedModule { }
