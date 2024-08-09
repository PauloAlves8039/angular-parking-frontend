import { Entity } from './Entity';

export class CustomerVehicle extends Entity {
  customerId: number;
  vehicleId: number;

  constructor() {
    super();
    this.customerId = 0;
    this.vehicleId = 0;
  }
}
