import { Injectable } from '@angular/core';
import { Stay } from '../../models/Stay';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../../models/Customer';
import { Vehicle } from '../../models/Vehicle';

@Injectable({
  providedIn: 'root',
})
export class StayService extends DataService<Stay> {
  private apiUrl: string = 'https://localhost:7199/api/Stay';
  private apiUrlCustomer: string = 'https://localhost:7199/api/Customers';
  private apiUrlVehicle: string = 'https://localhost:7199/api/Vehicle';

  constructor(http: HttpClient) {
    super(http, 'https://localhost:7199/api/Stay');
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.apiUrlCustomer);
  }

  getAllVehicles(): Observable<Vehicle[]> {
    return this.httpClient.get<Vehicle[]>(this.apiUrlVehicle);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(`${this.apiUrlCustomer}/${id}`);
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.httpClient.get<Vehicle>(`${this.apiUrlVehicle}/${id}`);
  }

  generatePdf(id: number) {
    return this.httpClient.get(`${this.apiUrl}/ticket/${id}`, { responseType: 'blob' });
  }
}
