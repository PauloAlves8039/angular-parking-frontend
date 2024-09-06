import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (error) => console.error('Login failed', error),
      });
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
    console.log(`Navigate to register!`);
  }

}
