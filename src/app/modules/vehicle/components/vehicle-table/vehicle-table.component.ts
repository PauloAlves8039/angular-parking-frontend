import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../../core/models/Vehicle';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss'],
})
export class VehicleTableComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: any[] = [];
  pagedVehicles: Vehicle[] = [];
  vehicle: Vehicle = new Vehicle();
  isUpdateMode: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  public modalIdVehicle: string = 'vehicleModal';

  constructor(
    private vehicleService: VehicleService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAll();
  }

  async getAll() {
    try {
      const vehicles = await lastValueFrom(this.vehicleService.getAll());
      this.vehicles = vehicles;
      this.filteredVehicles = [...this.vehicles];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all vehicles: ${error}`, 'Error');
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.vehicleService.delete(id));
      this.getAll();
      this.notificationService.showSuccess('Vehicle deleted successfully!', 'Success');
    } catch (error) {
      this.notificationService.showError(`Error deleting vehicle: ${error}`, 'Error');
    }
  }

  searchVehicles() {
    if (this.searchTerm.trim() !== '') {
      this.filteredVehicles = this.vehicles.filter(
        (vehicle: Vehicle) =>
          vehicle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          vehicle.model.includes(this.searchTerm)
      );
    } else {
      this.filteredVehicles = [...this.vehicles];
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
    this.vehicle = new Vehicle();
  }

  onUpdate(vehicle: Vehicle) {
    this.vehicle = { ...vehicle };
    this.openModal(this.modalIdVehicle, true);
  }

  onDelete(vehicle: Vehicle) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the vehicle ${vehicle.brand}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00BFFF',
      cancelButtonColor: '#FF4500',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(vehicle.id);
        Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
      }
    });
  }

  openModal(modalId: string, isUpdateMode: boolean = false) {
    this.isUpdateMode = isUpdateMode;
    if (!isUpdateMode) {
      this.vehicle = new Vehicle();
    }
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
    this.pagedVehicles = this.filteredVehicles.slice(
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
