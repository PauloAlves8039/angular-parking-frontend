import { Injectable } from '@angular/core';
import { Address } from '../../models/Address';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AddressService extends DataService<Address> {

  constructor(http: HttpClient) {
    super(http, 'https://localhost:7199/api/Address');
  }
}
