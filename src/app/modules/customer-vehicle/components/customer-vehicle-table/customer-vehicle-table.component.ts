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
  customerVehicle: CustomerVehicle = new CustomerVehicle();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  private modalIdcustomerVehicle: string = 'customerVehicleModal';

  constructor(
    private customerVehicleService: CustomerVehicleService,
    private modalService: ModalService,
    private customerService: CustomerService,
    private vehicleService: VehicleService
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
    } catch (error) {
      console.error(`Error loading all customers and associated vehicles: ${error}`);
    }
  }

  async save() {
    try {
      await lastValueFrom(this.customerVehicleService.create(this.customerVehicle));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error adding customer and associated vehicle: ${error}`);
    }
  }

  async update() {
    try {
      await lastValueFrom(this.customerVehicleService.update(this.customerVehicle.id, this.customerVehicle));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error updating customer and associated vehicle: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.customerVehicleService.delete(id));
      this.getAll();
    } catch (error) {
      console.error(`Error deleting customer and associated vehicle: ${error}`);
    }
  }

  async getCustomersAndVehicles() {
    try {
      this.customers = await lastValueFrom(this.customerService.getAll());
      this.vehicles = await lastValueFrom(this.vehicleService.getAll());
    } catch (error) {
      console.error('Error loading customers or vehicles:', error);
    }
  }

  searchCustomerVehicle() {
    const searchTermNumber = Number(this.searchTerm.trim());

    if (!isNaN(searchTermNumber)) {
      this.filteredCustomerVehicle = this.customersVehicles.filter(
        (customerVehicle: CustomerVehicle) =>
          customerVehicle.customerId === searchTermNumber ||
          customerVehicle.vehicleId === searchTermNumber
      );
    } else {
      this.filteredCustomerVehicle = [...this.customersVehicles];
    }
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
}
