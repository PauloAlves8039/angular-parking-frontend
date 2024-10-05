import { Component, OnInit } from '@angular/core';
import { Stay } from '../../../../core/models/Stay';
import { StayService } from '../../../../core/services/stay/Stay.service';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification/notification.service';

@Component({
  selector: 'app-stay-table',
  templateUrl: './stay-table.component.html',
  styleUrls: ['./stay-table.component.scss'],
})
export class StayTableComponent implements OnInit {
  stays: Stay[] = [];
  filteredStays: Stay[] = [];
  pagedStays: Stay[] = [];
  stay: Stay = new Stay();
  isUpdateMode: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  customerVehicleDetails: any[] = [];

  public modalIdStay: string = 'stayModal';

  constructor(
    private stayService: StayService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAll();
    this.getCustomerVehicleDetails();
  }

  async getAll() {
    try {
      const stays = await lastValueFrom(this.stayService.getAll());
      this.stays = stays;
      this.filteredStays = [...this.stays];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all stays: ${error}`, 'Error');
    }
  }

  async getCustomerVehicleDetails() {
    try {
      const details = await lastValueFrom(this.stayService.getCustomerVehicleDetails());
      this.customerVehicleDetails = details;
    } catch (error) {
      this.notificationService.showError(`Error loading customer vehicle details: ${error}`,'Error');
    }
  }

  getCustomerVehicle(stay: Stay) {
    const customerVehicle = this.customerVehicleDetails.find(cv => cv.id === stay.customerVehicleId);
    return customerVehicle ? `${customerVehicle.customerName} - ${customerVehicle.vehicleBrand}` : 'N/A';
  }

  async update(stay: Stay) {
    const confirmFinish = window.confirm('Are you sure you want to finish this stay?');

    if (confirmFinish) {
      try {
        await lastValueFrom(this.stayService.update(stay.id, stay));
        this.getAll();
        this.notificationService.showSuccess('Stay finished successfully!','Success');
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
      this.notificationService.showSuccess(
        'Stay deleted successfully!', 'Success');
    } catch (error) {
      this.notificationService.showError(`Error deleting stay: ${error}`, 'Error');
    }
  }

  async onGeneratePdf(stay: Stay) {
    try {
      const pdfBlob: Blob = await lastValueFrom(
        this.stayService.generatePdf(stay.id)
      );
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

  searchStays() {
    if (this.searchTerm.trim() !== '') {
      this.filteredStays = this.stays.filter(
        (stay: Stay) =>
          stay.licensePlate
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
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
    this.openModal(this.modalIdStay, true);
  }

  openModal(modalId: string, isUpdateMode: boolean = false) {
    this.isUpdateMode = isUpdateMode;
    if (!isUpdateMode) {
      this.stay = new Stay();
    }
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
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
}
