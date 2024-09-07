import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthHelper } from '../../helpers/auth-helper';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private authHelper: AuthHelper,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (error) => this.notificationService.showError(`Login failed: ${error}`, 'Check your email or password'),
      });
  }
  
  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  clearForm() {
    this.authHelper.clearAuthFields(this);
  }

  validateFields() {
    this.authHelper.validateAuthFields(this);
  }
}
