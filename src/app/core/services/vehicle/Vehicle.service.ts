import { Injectable } from '@angular/core';
import { Vehicle } from '../../models/Vehicle';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VehicleService extends DataService<Vehicle> {

  constructor(http: HttpClient) {
    super(http, 'https://localhost:7199/api/Vehicle');
  }
}
