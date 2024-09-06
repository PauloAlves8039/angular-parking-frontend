import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AUTH_ROUTES } from './auth.routing';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [AuthComponent, RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AUTH_ROUTES)
  ],
  providers: [AuthGuard],
  exports: [
    AuthComponent,
    RegisterComponent
  ]
})
export class AuthModule { }
