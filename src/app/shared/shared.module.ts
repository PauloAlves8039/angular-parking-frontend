import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
