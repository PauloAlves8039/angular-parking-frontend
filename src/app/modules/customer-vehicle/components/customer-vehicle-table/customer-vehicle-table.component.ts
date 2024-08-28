import { Component, OnInit } from '@angular/core';
import { CustomerVehicle } from '../../../../core/models/CustomerVehicle';
import { CustomerVehicleService } from '../../../../core/services/customer-vehicle/CustomerVehicle.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-customer-vehicle-table',
  templateUrl: './customer-vehicle-table.component.html',
  styleUrls: ['./customer-vehicle-table.component.scss'],
})
export class CustomerVehicleTableComponent implements OnInit, BaseComponent<CustomerVehicle> {
  customersVehicles: CustomerVehicle[] = [];
  filteredCustomerVehicle: CustomerVehicle[] = [];
  customerVehicle: CustomerVehicle = new CustomerVehicle();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'customerId', header: 'Cliente' },
    { key: 'vehicleId', header: 'Veículo' },
  ];

  private modalIdcustomerVehicle: string = 'customerVehicleModal';

  constructor(
    private customerVehicleService: CustomerVehicleService,
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
}
