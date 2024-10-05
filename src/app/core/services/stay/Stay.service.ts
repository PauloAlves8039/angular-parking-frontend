import { Injectable } from '@angular/core';
import { Stay } from '../../models/Stay';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';
import { catchError, combineLatest, map, Observable, switchMap, throwError } from 'rxjs';
import { Customer } from '../../models/Customer';
import { Vehicle } from '../../models/Vehicle';
import { VehicleService } from '../vehicle/Vehicle.service';
import { CustomerService } from '../customer/Customer.service';
import { CustomerVehicle } from '../../models/CustomerVehicle';
import { NotificationService } from '../../../shared/services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class StayService extends DataService<Stay> {
  private apiUrl: string = 'https://localhost:7199/api/Stay';

  constructor(
    http: HttpClient,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private notificationService: NotificationService
  ) {
    super(http, 'https://localhost:7199/api/Stay');
  }

  generatePdf(id: number) {
    return this.httpClient.get(`${this.apiUrl}/ticket/${id}`, {
      responseType: 'blob',
    });
  }

  getCustomerVehicleDetails(): Observable<any> {
    return this.httpClient
      .get<CustomerVehicle[]>('https://localhost:7199/api/CustomerVehicle')
      .pipe(
        switchMap((customerVehicles) => {
          const customerIds = [...new Set(customerVehicles.map((cv) => cv.customerId)),];
          const vehicleIds = [...new Set(customerVehicles.map((cv) => cv.vehicleId)),];

          return combineLatest([
            this.customerService.getAll().pipe(
              map((customers) => {
                const customerMap: { [key: number]: Customer } = {};
                customers.forEach((customer) => {
                  customerMap[customer.id] = customer;
                });
                return customerMap;
              })
            ),
            this.vehicleService.getAll().pipe(
              map((vehicles) => {
                const vehicleMap: { [key: number]: Vehicle } = {};
                vehicles.forEach((vehicle) => {
                  vehicleMap[vehicle.id] = vehicle;
                });
                return vehicleMap;
              })
            ),
          ]).pipe(
            map(([customerMap, vehicleMap]) =>
              customerVehicles.map((cv) => ({
                id: cv.id,
                customerName: customerMap[cv.customerId]?.name || 'Unknown Customer',
                vehicleBrand: vehicleMap[cv.vehicleId]?.brand || 'Unknown Vehicle',
              }))
            )
          );
        }),
        catchError((error) => {
          this.notificationService.showError(`Error fetching customer vehicle details: ${error}`, 'Error');
          return throwError(
            () => new Error('Failed to load customer vehicle details')
          );
        })
      );
  }
}
