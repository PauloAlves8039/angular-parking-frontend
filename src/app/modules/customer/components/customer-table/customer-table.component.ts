import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { Customer } from '../../../../core/models/Customer';
import { lastValueFrom } from 'rxjs';
import { AddressService } from '../../../../core/services/address/Address.service';
import { Address } from '../../../../core/models/Address';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit {
  customers: Customer[] = [];
  addresses: Address[] = [];
  filteredCustomers: Customer[] = [];
  pagedCustomers: Customer[] = [];
  customer: Customer = new Customer();
  isUpdateMode: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  public modalIdCustomer: string = 'customerModal';

  constructor(
    private customerService: CustomerService,
    private addressService: AddressService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAll();
    this.getAllAddresses();
  }

  async getAll() {
    try {
      const customers = await lastValueFrom(this.customerService.getAll());
      this.addresses = await lastValueFrom(this.addressService.getAll());
      this.customers = customers.map((customer) => {
        const address = this.getAddressById(customer.addressId);
        return { ...customer, address };
      });
      this.filteredCustomers = [...this.customers];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all customers: ${error}`, 'Error');
    }
  }

  getAddressById(addressId: number): Address | undefined {
    const address = this.addresses.find((address) => address.id === addressId);
    return address;
  }

  async delete(id: number) {
    if (confirm(`Do you really want to delete the customer?`)) {
      try {
        await lastValueFrom(this.customerService.delete(id));
        this.getAll();
        this.notificationService.showSuccess('Customer deleted successfully!', 'Success');
      } catch (error) {
        this.notificationService.showError(`Error deleting customer: ${error}`, 'Error');
      }
    }
  }

  async getAllAddresses() {
    try {
      this.addresses = await lastValueFrom(this.addressService.getAll());
    } catch (error) {
      this.notificationService.showError(`Error loading all addresses: ${error}`, 'Error');
    }
  }

  searchCustomers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredCustomers = this.customers.filter(
        (customer: Customer) =>
          customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.cpf.includes(this.searchTerm) ||
          customer.address?.street.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.address?.city.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCustomers = [...this.customers];
    }
    this.updatePagination();
  }

  onUpdate(customer: Customer) {
    this.customer = { ...customer };
    this.openModal(this.modalIdCustomer, true);
  }

  onDelete(customer: Customer) {
    if (confirm(`Do you really want to delete the customer ${customer.name}?`)) {
      this.delete(customer.id);
    }
  }

  openModal(modalId: string, isUpdateMode: boolean = false) {
    this.isUpdateMode = isUpdateMode;
    if (!isUpdateMode) {
      this.customer = new Customer();
    }
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAll();
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
