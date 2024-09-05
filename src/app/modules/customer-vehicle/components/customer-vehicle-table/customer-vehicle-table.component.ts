import { Component, OnInit } from '@angular/core';
import { CustomerVehicle } from '../../../../core/models/CustomerVehicle';
import { CustomerVehicleService } from '../../../../core/services/customer-vehicle/CustomerVehicle.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';
import { Customer } from '../../../../core/models/Customer';
import { Vehicle } from '../../../../core/models/Vehicle';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-customer-vehicle-table',
  templateUrl: './customer-vehicle-table.component.html',
  styleUrls: ['./customer-vehicle-table.component.scss'],
})
export class CustomerVehicleTableComponent implements OnInit, BaseComponent<CustomerVehicle> {
  customersVehicles: CustomerVehicle[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  filteredCustomerVehicle: CustomerVehicle[] = [];
  pagedCustomersVehicles: CustomerVehicle[] = [];
  customerVehicle: CustomerVehicle = new CustomerVehicle();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  customerVehicleForm!: FormGroup;

  private modalIdcustomerVehicle: string = 'customerVehicleModal';

  constructor(
    private customerVehicleService: CustomerVehicleService,
    private modalService: ModalService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAll();
    this.getCustomersAndVehicles();
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
      const customersVehicles = await lastValueFrom(this.customerVehicleService.getAll());
      this.customersVehicles = customersVehicles;
      this.filteredCustomerVehicle = [...this.customersVehicles];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all customers and associated vehicles: ${error}`, 'Error');
    }
  }

  async save() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.customerVehicleService.create(this.customerVehicle));
        this.getAll();
        this.resetModal();
        this.notificationService.showSuccess('Association added successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error adding association: ${error}`, 'Error');
    }
  }

  async update() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.customerVehicleService.update(this.customerVehicle.id, this.customerVehicle));
        this.getAll();
        this.resetModal();
        this.notificationService.showSuccess('Association updated successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error updating association: ${error}`, 'Error');
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

  clearModalFields(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.customerVehicle = new CustomerVehicle();
  }

  onUpdate(customerVehicle: CustomerVehicle) {
    this.isUpdateMode = true;
    this.customerVehicle = { ...customerVehicle };
    this.openModal();
  }

  onDelete(customerVehicle: CustomerVehicle) {
    if (confirm(`Do you really want to delete the customer and associated vehicle?`)) {
      this.delete(customerVehicle.id);
    }
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.customerVehicle = new CustomerVehicle();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdcustomerVehicle);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdcustomerVehicle);
  }

  resetModal() {
    this.modalService.resetModal<CustomerVehicle>(
      this.modalIdcustomerVehicle,
      this.customerVehicle,
      () => new CustomerVehicle(),
      this.timeValueModal
    );
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

  validateFields(): boolean {
    return (
      !!this.customerVehicle.customerId &&
      !!this.customerVehicle.vehicleId
    );
  }
}
