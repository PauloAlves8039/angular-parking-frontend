import { Injectable } from '@angular/core';
import { Customer } from '../../models/Customer';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends DataService<Customer> {

  constructor(http: HttpClient) {
    super(http, 'https://localhost:7199/api/Customers');
  }
}
