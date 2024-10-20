import { Component, OnInit } from '@angular/core';
import { CustomerVehicle } from '../../../../core/models/CustomerVehicle';
import { CustomerVehicleService } from '../../../../core/services/customer-vehicle/CustomerVehicle.service';
import { lastValueFrom } from 'rxjs';
import { Customer } from '../../../../core/models/Customer';
import { Vehicle } from '../../../../core/models/Vehicle';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-vehicle-table',
  templateUrl: './customer-vehicle-table.component.html',
  styleUrls: ['./customer-vehicle-table.component.scss'],
})
export class CustomerVehicleTableComponent implements OnInit {
  customersVehicles: CustomerVehicle[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  filteredCustomerVehicle: CustomerVehicle[] = [];
  pagedCustomersVehicles: CustomerVehicle[] = [];
  customerVehicle: CustomerVehicle = new CustomerVehicle();
  isUpdateMode: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  public modalIdcustomerVehicle: string = 'customerVehicleModal';

  constructor(
    private customerVehicleService: CustomerVehicleService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAll();
    this.getCustomersAndVehicles();
  }


  async getAll() {
    try {
      const customersVehicles = await lastValueFrom(this.customerVehicleService.getAll());
      this.customersVehicles = customersVehicles;
      this.filteredCustomerVehicle = [...this.customersVehicles];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all customers and associated vehicles: ${error}`, 'Error');
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.customerVehicleService.delete(id));
      this.getAll();
      this.notificationService.showSuccess('Association deleted successfully!', 'Success');
    } catch (error) {
      this.notificationService.showError(`Error deleting association: ${error}`, 'Error');
    }
  }

  async getCustomersAndVehicles() {
    try {
      this.customers = await lastValueFrom(this.customerService.getAll());
      this.vehicles = await lastValueFrom(this.vehicleService.getAll());
    } catch (error) {
      this.notificationService.showError(`Error loading customers or vehicles: ${error}`, 'Error');
    }
  }

  searchCustomerVehicle() {
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    if (searchTermLower) {
      this.filteredCustomerVehicle = this.customersVehicles.filter((customerVehicle: CustomerVehicle) => {
        const customerName = this.getCustomerName(customerVehicle.customerId).toLowerCase();
        const vehicleModel = this.getVehicleModel(customerVehicle.vehicleId).toLowerCase();

        return customerName.includes(searchTermLower) || vehicleModel.includes(searchTermLower);
      });
    } else {
      this.filteredCustomerVehicle = [...this.customersVehicles];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAll();
  }

  onUpdate(customerVehicle: CustomerVehicle) {
    this.customerVehicle = { ...customerVehicle };
    this.openModal(this.modalIdcustomerVehicle, true);
  }

  onDelete(customerVehicle: CustomerVehicle) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the customer ${this.getCustomerName(customerVehicle.customerId)} and the associated vehicle ${this.getVehicleModel(customerVehicle.vehicleId)}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00BFFF',
      cancelButtonColor: '#FF4500',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(customerVehicle.id);
        Swal.fire('Deleted!', 'The customer-vehicle association has been deleted.', 'success');
      }
    });
  }

  openModal(modalId: string, isUpdateMode: boolean = false) {
    this.isUpdateMode = isUpdateMode;
    if (!isUpdateMode) {
      this.customerVehicle = new CustomerVehicle();
    }
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Desconhecido';
  }

  getVehicleModel(vehicleId: number): string {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.model : 'Desconhecido';
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCustomerVehicle.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.pagedCustomersVehicles = this.filteredCustomerVehicle.slice(
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
