import { Customer } from './Customer';
import { Entity } from './Entity';
import { Vehicle } from './Vehicle';

export class Stay extends Entity {
  customerVehicleId?: number;
  licensePlate: string;
  entryDate: Date;
  exitDate?: Date;
  hourlyRate: number;
  totalAmount?: number;
  stayStatus: string;
  customer?: Customer;
  vehicle?: Vehicle;

  constructor() {
    super();
    this.customerVehicleId = 0;
    this.licensePlate = '';
    this.entryDate = new Date();
    this.exitDate = undefined;
    this.hourlyRate = 0;
    this.totalAmount = 0;
    this.stayStatus = '';
    this.customer = new Customer();
    this.vehicle = new Vehicle();
  }
}
