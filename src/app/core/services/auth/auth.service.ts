import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7199/api/User/login';
  private apiRegisterUrl = 'https://localhost:7199/api/User/register';

  private loggedInUserSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public loggedInUser$: Observable<string | null> = this.loggedInUserSubject.asObservable();


  constructor(private http: HttpClient) {
    const email = this.getEmailFromToken();
    if (email) {
      this.loggedInUserSubject.next(email);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        const email = this.getEmailFromToken();
        if (email) {
          this.loggedInUserSubject.next(email);
        }
      })
    );
  }

  register(user: { email: string; password: string; confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.apiRegisterUrl}`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedInUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (token) {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date).getTime() / 1000)) < expiry;
    }
    return false;
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name || null;
    }
    return null;
  }

}
