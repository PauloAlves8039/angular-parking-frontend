import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  userEmail: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.updateAuthenticationStatus();
    this.addSidebarToggleEvent();

    this.authService.loggedInUser$.subscribe(email => {
      this.userEmail = email;
    });

    this.router.events.subscribe(() => {
      this.updateAuthenticationStatus();
    });
  }

  private updateAuthenticationStatus() {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  private addSidebarToggleEvent() {
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    if (sidebarCollapse && sidebar && content) {
      sidebarCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        content.classList.toggle('active');
      });
    }
  }

  logOut() {
    this.authService.logout();

    this.isAuthenticated = false;
    this.userEmail = null;

    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
