import { Component, OnInit } from '@angular/core';
import { Stay } from '../../../../core/models/Stay';
import { StayService } from '../../../../core/services/stay/Stay.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { Vehicle } from '../../../../core/models/Vehicle';
import { Customer } from '../../../../core/models/Customer';
import { FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-stay-table',
  templateUrl: './stay-table.component.html',
  styleUrls: ['./stay-table.component.scss'],
})
export class StayTableComponent implements OnInit, BaseComponent<Stay> {
  stays: Stay[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  filteredStays: Stay[] = [];
  pagedStays: Stay[] = [];
  stay: Stay = new Stay();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  stayForm!: FormGroup;
  customerVehicleOptions: { customer: Customer; vehicle: Vehicle; display: string }[] = [];
  selectedOption: { customer: Customer; vehicle: Vehicle } | null = null;

  private modalIdStay: string = 'stayModal';

  constructor(
    private stayService: StayService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAll();
    this.loadCustomers();
    this.loadVehicles();
  }

  async loadCustomers() {
    try {
      const customers = await this.customerService.getAll().toPromise();
      this.customers = customers || [];
      this.updateCustomerVehicleOptions();
    } catch (error) {
      this.notificationService.showError(`Error loading customers: ${error}`, 'Error');
      this.customers = [];
    }
  }

  async loadVehicles() {
    try {
      const vehicles = await this.vehicleService.getAll().toPromise();
      this.vehicles = vehicles || [];
      this.updateCustomerVehicleOptions();
    } catch (error) {
      this.notificationService.showError(`Error loading vehicles: ${error}`, 'Error');
      this.vehicles = [];
    }
  }

  async getAll() {
    try {
      const stays = await lastValueFrom(this.stayService.getAll());
      this.stays = await Promise.all(stays.map(async stay => {
        if (stay.customerVehicleId) {
          stay.customer = await this.customerService.getById(stay.customerVehicleId).toPromise();
          stay.vehicle = await this.vehicleService.getById(stay.customerVehicleId).toPromise();
        }
        return stay;
      }));
      this.filteredStays = [...this.stays];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all stays: ${error}`, 'Error');
    }
  }

  async save() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.stayService.create(this.stay));
        this.getAll();
        this.resetModal();
        this.notificationService.showSuccess('Stay added successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error adding stay: ${error}`, 'Error');
    }
  }

  async update(stay: Stay) {
    const confirmFinish = window.confirm('Are you sure you want to finish this stay?');

    if (confirmFinish) {
      try {
        await lastValueFrom(this.stayService.update(stay.id, stay));
        this.getAll();
        this.notificationService.showSuccess('Stay finished successfully!', 'Success');
      } catch (error) {
        this.notificationService.showError(`Error finishing stay: ${error}`, 'Error');
      }
    } else {
      this.notificationService.showInfo('Stay was not finished.', 'Cancelled');
    }
  }


  async delete(id: number) {
    try {
      await lastValueFrom(this.stayService.delete(id));
      this.getAll();
      this.notificationService.showSuccess('Stay deleted successfully!', 'Success');
    } catch (error) {
      this.notificationService.showError(`Error deleting stay: ${error}`, 'Error');
    }
  }

  async onGeneratePdf(stay: Stay) {
    try {
      const pdfBlob: Blob = await lastValueFrom(this.stayService.generatePdf(stay.id));
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Stay.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      this.notificationService.showError(`Error generating PDF ${error}`, 'Error');
    }
  }

  updateCustomerVehicleOptions() {
    this.customerVehicleOptions = this.customers.flatMap(customer =>
      this.vehicles.map(vehicle => ({customer, vehicle,
        display: `${customer.name} - ${vehicle.brand} - ${vehicle.model}`
      }))
    );
  }

  onCustomerVehicleChange(selectedOption: { customer: Customer; vehicle: Vehicle }) {
    this.selectedOption = selectedOption;
    this.stay.customerVehicleId = selectedOption.customer.id;
    this.stay.customerVehicleId = selectedOption.vehicle.id;
  }

  searchStays() {
    if (this.searchTerm.trim() !== '') {
      this.filteredStays = this.stays.filter(
        (stay: Stay) =>
          stay.licensePlate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          stay.stayStatus.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredStays = [...this.stays];
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
    this.stay = new Stay();
  }

  onUpdate(stay: Stay) {
    this.isUpdateMode = true;
    this.stay = { ...stay };
    this.update(stay);
  }

  onDelete(stay: Stay) {
    if (confirm(`Do you really want to exclude stay ${stay.licensePlate}?`)) {
      this.delete(stay.id);
    }
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.stay = new Stay();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdStay);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdStay);
  }

  resetModal() {
    this.modalService.resetModal<Stay>(
      this.modalIdStay,
      this.stay,
      () => new Stay(),
      this.timeValueModal
    );
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredStays.length / this.itemsPerPage);
    this.pagedStays = this.filteredStays.slice(
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
      !!this.stay.customerVehicleId &&
      !!this.stay.licensePlate &&
      !!this.stay.entryDate &&
      !!this.stay.hourlyRate
    );
  }
}
