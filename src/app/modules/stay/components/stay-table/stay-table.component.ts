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

  private modalIdStay: string = 'stayModal';

  constructor(
    private stayService: StayService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAll();
    this.loadCustomers();
    this.loadVehicles();
  }

  async loadCustomers() {
    try {
      this.customers = await lastValueFrom(this.stayService.getAllCustomers());
    } catch (error) {
      console.error(`Error loading customers: ${error}`);
    }
  }

  async loadVehicles() {
    try {
      this.vehicles = await lastValueFrom(this.stayService.getAllVehicles());
    } catch (error) {
      console.error(`Error loading vehicles: ${error}`);
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
      console.error(`Error loading all stays: ${error}`);
    }
  }

  async save() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.stayService.create(this.stay));
        this.getAll();
        this.resetModal();
      } else {
        alert('Please fill in all required fields');
      }
    } catch (error) {
      console.error(`Error adding stay: ${error}`);
    }
  }

  async update(stay: Stay) {
    try {
      await lastValueFrom(this.stayService.update(stay.id, stay));
      this.getAll();
    } catch (error) {
      console.error(`Error updating stay: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.stayService.delete(id));
      this.getAll();
    } catch (error) {
      console.error(`Error deleting stay: ${error}`);
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
      console.error(`Error generating PDF: ${error}`);
    }
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
