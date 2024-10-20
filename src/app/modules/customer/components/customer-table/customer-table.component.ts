import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { Customer } from '../../../../core/models/Customer';
import { lastValueFrom } from 'rxjs';
import { AddressService } from '../../../../core/services/address/Address.service';
import { Address } from '../../../../core/models/Address';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import Swal from 'sweetalert2';

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
    try {
      await lastValueFrom(this.customerService.delete(id));
      this.getAll();
      this.notificationService.showSuccess('Customer deleted successfully!', 'Success');
    } catch (error) {
      this.notificationService.showError(`Error deleting customer: ${error}`, 'Error');
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
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the customer ${customer.name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00BFFF',
      cancelButtonColor: '#FF4500',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const linkedAddress = this.getAddressById(customer.addressId);

        if (linkedAddress) {
          Swal.fire({
            title: 'This customer is linked to an address',
            text: `Customer ${customer.name} is associated with the address at ${linkedAddress.street}. Do you also want to remove this association?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#00BFFF',
            cancelButtonColor: '#FF4500',
            confirmButtonText: 'Yes, proceed!',
            cancelButtonText: 'No, keep the address',
          }).then((secondResult) => {
            if (secondResult.isConfirmed) {
              this.delete(customer.id);
              Swal.fire('Deleted!', 'The customer and associated address have been handled.', 'success');
            }
          });
        } else {
          this.delete(customer.id);
          Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
        }
      }
    });
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
