import { Component, OnInit } from '@angular/core';
import { Address } from '../../../../core/models/Address';
import { AddressService } from '../../../../core/services/address/Address.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';
import { CheckZipCodeService } from '../../../../shared/services/check-zip-code/CheckZipCode.service';

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

  states = [
    { acronym: 'AC' }, { acronym: 'AL' }, { acronym: 'AP' }, { acronym: 'AM' },
    { acronym: 'BA' }, { acronym: 'CE' }, { acronym: 'DF' }, { acronym: 'ES' },
    { acronym: 'GO' }, { acronym: 'MA' }, { acronym: 'MT' }, { acronym: 'MS' },
    { acronym: 'MG' }, { acronym: 'PA' }, { acronym: 'PB' }, { acronym: 'PR' },
    { acronym: 'PE' }, { acronym: 'PI' }, { acronym: 'RJ' }, { acronym: 'RN' },
    { acronym: 'RS' }, { acronym: 'RO' }, { acronym: 'RR' }, { acronym: 'SC' },
    { acronym: 'SP' }, { acronym: 'SE' }, { acronym: 'TO' }
  ];

  private modalIdAddress: string = 'addressModal';

  constructor(
    private addressService: AddressService,
    private modalService: ModalService,
    private checkZipCodeService: CheckZipCodeService
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

  async searchZipCode() {
    try {
      const result = await lastValueFrom(this.checkZipCodeService.checkZipCode(this.address.zipCode));
      this.address.street = result.logradouro;
      this.address.neighborhood = result.bairro;
      this.address.city = result.localidade;
      this.address.federativeUnit = result.uf;
      this.address.zipCode = this.formatZipCode(this.address.zipCode);
    } catch (error) {
      alert(`Error searching for ZIP code. Check that the zip code is correct and try again: ${error}`);
    }
  }

  formatZipCode(zipCode: string): string {
    if (!zipCode){
      return '';
    }

    const cleaned = zipCode.replace(/\D/g, '');
    return cleaned.length <= 5 ? cleaned : `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
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

  clearModalFields(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.address = new Address();
  }

  onUpdate(address: Address) {
    this.isUpdateMode = true;
    this.address = { ...address };
    this.openModal();
  }

  onDelete(address: Address) {
    if (confirm(`Do you really want to delete the address ${address.street}?`)) {
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
