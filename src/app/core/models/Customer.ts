import { Address } from './Address';
import { Entity } from './Entity';

export class Customer extends Entity {
  name: string;
  birthDate: Date;
  cpf: string;
  phone: string;
  email: string;
  addressId: number;
  address?: Address;

  constructor() {
    super();
    this.name = '';
    this.birthDate = new Date();
    this.cpf = '';
    this.phone = '';
    this.email = '';
    this.addressId = 0;
  }
}
