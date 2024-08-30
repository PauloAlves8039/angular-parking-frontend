import { Customer } from './Customer';
import { Entity } from './Entity';
import { Vehicle } from './Vehicle';

export class CustomerVehicle extends Entity {
  customerId: number;
  vehicleId: number;
  customer: Customer;
  vehicle: Vehicle;

  constructor() {
    super();
    this.customerId = 0;
    this.vehicleId = 0;
    this.customer = new Customer();
    this.vehicle = new Vehicle();
  }
}
