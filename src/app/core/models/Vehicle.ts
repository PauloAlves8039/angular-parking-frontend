import { Entity } from './Entity';

export class Vehicle extends Entity {
  vehicleType: string;
  brand: string;
  model: string;
  color: string;
  vehicleYear: number;
  notes?: string;

  constructor() {
    super();
    this.vehicleType = '';
    this.brand = '';
    this.model = '';
    this.color = '';
    this.vehicleYear = 0;
    this.notes = '';
  }
}
