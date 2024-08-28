import { Component, OnInit } from '@angular/core';
import { Address } from '../../../../core/models/Address';
import { AddressService } from '../../../../core/services/address/Address.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.scss'],
})
export class AddressTableComponent implements OnInit, BaseComponent<Address> {
  addresses: Address[] = [];
  filteredAddresses: any[] = [];
  address: Address = new Address();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'street', header: 'Logradouro' },
    { key: 'number', header: 'Número' },
    { key: 'complement', header: 'Complemento' },
    { key: 'neighborhood', header: 'Bairro' },
    { key: 'federativeUnit', header: 'Estado' },
    { key: 'city', header: 'Cidade' },
    { key: 'zipCode', header: 'CEP' },
  ];

  private modalIdAddress: string = 'addressModal';

  constructor(
    private addressService: AddressService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAll();
  }

  saveOrUpdate() {
    if (this.isUpdateMode) {
      this.update();
    } else {
      this.save();
    }
  }

  async getAll() {
    try {
      const addresses = await lastValueFrom(this.addressService.getAll());
      this.addresses = addresses;
      this.filteredAddresses = [...this.addresses];
    } catch (error) {
      console.error(`Error loading all addresses: ${error}`);
    }
  }

  async save() {
    try {
      await lastValueFrom(this.addressService.create(this.address));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error adding address: ${error}`);
    }
  }

  async update() {
    try {
      await lastValueFrom(this.addressService.update(this.address.id, this.address));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error updating address: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.addressService.delete(id));
      this.getAll();
    } catch (error) {
      console.error(`Error deleting address: ${error}`);
    }
  }

  searchAddresses() {
    if (this.searchTerm.trim() !== '') {
      this.filteredAddresses = this.addresses.filter(
        (address: Address) =>
          address.street.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          address.zipCode.includes(this.searchTerm)
      );
    } else {
      this.filteredAddresses = [...this.addresses];
    }
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAll();
  }

  onUpdate(address: Address) {
    this.isUpdateMode = true;
    this.address = { ...address };
    this.openModal();
  }

  onDelete(address: Address) {
    if (
      confirm(`Do you really want to delete the address ${address.street}?`)
    ) {
      this.delete(address.id);
    }
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.address = new Address();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdAddress);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdAddress);
  }

  resetModal() {
    this.modalService.resetModal<Address>(
      this.modalIdAddress,
      this.address,
      () => new Address(),
      this.timeValueModal
    );
  }
}
