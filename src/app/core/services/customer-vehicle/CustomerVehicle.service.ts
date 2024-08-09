import { Injectable } from '@angular/core';
import { CustomerVehicle } from '../../models/CustomerVehicle';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerVehicleService extends DataService<CustomerVehicle> {

  constructor(http: HttpClient) {
    super(http, 'https://localhost:7199/api/CustomerVehicle');
  }
}
