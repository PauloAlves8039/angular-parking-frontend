import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { Customer } from '../../../../core/models/Customer';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';
import { AddressService } from '../../../../core/services/address/Address.service';
import { Address } from '../../../../core/models/Address';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit, BaseComponent<Customer> {
  customers: Customer[] = [];
  addresses: Address[] = [];
  filteredCustomers: Customer[] = [];
  customer: Customer = new Customer();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'name', header: 'Nome' },
    { key: 'birthDate', header: 'Data de Nascimento' },
    { key: 'cpf', header: 'CPF' },
    { key: 'phone', header: 'Telefone' },
    { key: 'email', header: 'Email' },
    { key: 'addressId', header: 'Endereço' },
  ];

  private modalIdCustomer: string = 'customerModal';

  constructor(
    private customerService: CustomerService,
    private modalService: ModalService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.getAll();
    this.getAllAddresses();
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
      const customers = await lastValueFrom(this.customerService.getAll());
      this.customers = customers;
      this.filteredCustomers = [...this.customers];
    } catch (error) {
      console.error(`Error loading all customers: ${error}`);
    }
  }

  async save() {
    try {
      await lastValueFrom(this.customerService.create(this.customer));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error adding customer: ${error}`);
    }
  }

  async update() {
    try {
      await lastValueFrom(this.customerService.update(this.customer.id, this.customer));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error updating customer: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.customerService.delete(id));
      this.getAll();
    } catch (error) {
      console.error(`Error deleting customer: ${error}`);
    }
  }

  async getAllAddresses() {
    try {
      const addresses = await lastValueFrom(this.addressService.getAll());
      this.addresses = addresses;
    } catch (error) {
      console.error(`Error loading all addresses: ${error}`);
    }
  }

  searchCustomers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredCustomers = this.customers.filter(
        (customer: Customer) =>
          customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.email
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          customer.phone.includes(this.searchTerm) ||
          customer.cpf.includes(this.searchTerm)
      );
    } else {
      this.filteredCustomers = [...this.customers];
    }
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAll();
  }

  onUpdate(customer: Customer) {
    this.isUpdateMode = true;
    this.customer = { ...customer };
    this.openModal();
  }

  onDelete(customer: Customer) {
    if (confirm(`Do you really want to delete the customer ${customer.name}?`)) {
      this.delete(customer.id);
    }
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.customer = new Customer();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdCustomer);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdCustomer);
  }

  resetModal() {
    this.modalService.resetModal<Customer>(
      this.modalIdCustomer,
      this.customer,
      () => new Customer(),
      this.timeValueModal
    );
  }
}
