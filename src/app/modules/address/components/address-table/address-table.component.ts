import { Component, OnInit } from '@angular/core';
import { Address } from '../../../../core/models/Address';
import { AddressService } from '../../../../core/services/address/Address.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.scss'],
})
export class AddressTableComponent implements OnInit {
  address: Address[] = [];

  columns = [
    { key: 'street', header: 'Logradouro' },
    { key: 'number', header: 'Número' },
    { key: 'complement', header: 'Complemento' },
    { key: 'neighborhood', header: 'Bairro' },
    { key: 'federativeUnit', header: 'Estado' },
    { key: 'city', header: 'Cidade' },
    { key: 'zipCode', header: 'CEP' },
  ];

  constructor(private addressService: AddressService) {}

  ngOnInit() {
    this.getAllAddress();
  }

  getAllAddress() {
    this.addressService.getAll().subscribe(
      (address) => {
        this.address = address;
      },
      (error) => {
        console.error(`Error loading all Address ${error}`);
      }
    );
  }

  onUpdate(address: Address) {
    console.log(`Updating Address ${address}`);
  }

  onDelete(address: Address) {
    console.log(`Deleting Address ${address}`);
  }
}
