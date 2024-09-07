import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { AuthHelper } from '../../helpers/auth-helper';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;
  timeValue: number = 2000;

  constructor(
    private authService: AuthService,
    private router: Router,
    private authHelper: AuthHelper,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const user = {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.notificationService.showSuccess('Registration successful!', 'Success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, this.timeValue);
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.notificationService.showError(`Registration failed: ${error}`, 'Registration error');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  clearForm() {
    this.authHelper.clearAuthFields(this);
  }

  validateFields() {
    this.authHelper.validateAuthFields(this);
  }
}
