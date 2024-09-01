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
  pagedCustomers: Customer[] = [];
  customer: Customer = new Customer();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

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
      this.addresses = await lastValueFrom(this.addressService.getAll());
      this.customers = customers.map(customer => {
        const address = this.getAddressById(customer.addressId);
        return { ...customer, address };
      });
      this.filteredCustomers = [...this.customers];
      this.updatePagination();
    } catch (error) {
      console.error(`Error loading all customers: ${error}`);
    }
  }

  getAddressById(addressId: number): Address | undefined {
    const address = this.addresses.find(address => address.id === addressId);
    return address;
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
      this.addresses = await lastValueFrom(this.addressService.getAll());
    } catch (error) {
      console.error(`Error loading all addresses: ${error}`);
    }
  }

  searchCustomers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredCustomers = this.customers.filter(
        (customer: Customer) =>
          customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.cpf.includes(this.searchTerm) ||
          (customer.address?.street.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
           customer.address?.city.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    } else {
      this.filteredCustomers = [...this.customers];
    }
    this.updatePagination();
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAll();
  }

  clearModalFields(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.customer = new Customer();
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

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    this.pagedCustomers = this.filteredCustomers.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }
}
