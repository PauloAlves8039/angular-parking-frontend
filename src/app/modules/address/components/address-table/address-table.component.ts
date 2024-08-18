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
  newAddress: Address = new Address();
  addressToUpdate: Address = new Address();
  timeValueModal: number = 200;

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

  onUpdate(address: Address) {
    this.openModalUpdate();
    this.addressToUpdate = { ...address };
  }

  onDelete(address: Address) {
    if (confirm(`Você realmente deseja excluir o endereço ${address.street}?`)) {
      this.delete(address.id);
    }
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

  save() {

  }

  update() {

  }

  delete(id: number) {
    
  }

  openModal() {
    const modalElement = document.getElementById('addressModalSave');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modalInstance.show();
    }
  }

  closeModal() {
    const modalElement = document.getElementById('addressModalSave');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modalInstance.hide();
    }
  }

  openModalUpdate() {
    const modalElement = document.getElementById('addressModalUpdate');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modalInstance.show();
    }
  }

  closeModalUpdate() {
    const modalElement = document.getElementById('addressModalUpdate');
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modalInstance.hide();
    }
  }
}
