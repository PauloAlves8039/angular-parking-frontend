import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckZipCodeService {
  private apiUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) {}

  checkZipCode(zipCode: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${zipCode}/json`);
  }

}
