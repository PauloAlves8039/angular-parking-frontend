import { Entity } from './Entity';

export class Address extends Entity {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  federativeUnit: string;
  city: string;
  zipCode: string;

  constructor() {
    super();
    this.street = '';
    this.number = '';
    this.complement = '';
    this.neighborhood = '';
    this.federativeUnit = '';
    this.city = '';
    this.zipCode = '';
  }
}
