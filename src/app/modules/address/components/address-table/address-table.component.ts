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
    this.addressService.create(this.newAddress).subscribe(
      (response) => {
        console.log('Address added successfully', response);
        this.getAllAddress();
        this.newAddress = new Address();
        setTimeout(() => this.closeModal(), this.timeValueModal);
      },
      (error) => {
        console.error(`Error adding address ${error}`);
      }
    );
  }

  update() {
    this.addressService
      .update(this.addressToUpdate.id, this.addressToUpdate)
      .subscribe(
        (response) => {
          console.log('Address updated successfully', response);
          this.getAllAddress();
          this.addressToUpdate = new Address();
          setTimeout(() => this.closeModalUpdate(), this.timeValueModal);
        },
        (error) => {
          console.error(`Error updating address ${error}`);
        }
      );
  }

  delete(id: number) {
    this.addressService.delete(id).subscribe(
      () => {
        console.log('Address deleted successfully');
        this.getAllAddress();
      },
      (error) => {
        console.error(`Error deleting address ${error}`);
      }
    );
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
