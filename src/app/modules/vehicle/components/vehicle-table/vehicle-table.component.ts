import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../../core/models/Vehicle';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss'],
})
export class VehicleTableComponent implements OnInit, BaseComponent<Vehicle> {
  vehicles: Vehicle[] = [];
  filteredVehicles: any[] = [];
  pagedVehicles: Vehicle[] = [];
  vehicle: Vehicle = new Vehicle();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  private modalIdVehicle: string = 'vehicleModal';

  constructor(
    private vehicleService: VehicleService,
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
      const vehicles = await lastValueFrom(this.vehicleService.getAll());
      this.vehicles = vehicles;
      this.filteredVehicles = [...this.vehicles];
      this.updatePagination();
    } catch (error) {
      console.error(`Error loading all vehicles: ${error}`);
    }
  }

  async save() {
    try {
      await lastValueFrom(this.vehicleService.create(this.vehicle));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error adding vehicle: ${error}`);
    }
  }

  async update() {
    try {
      await lastValueFrom(this.vehicleService.update(this.vehicle.id, this.vehicle));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error updating vehicle: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.vehicleService.delete(id));
      this.getAll();
    } catch (error) {
      console.error(`Error deleting vehicle: ${error}`);
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
    this.isUpdateMode = true;
    this.vehicle = { ...vehicle };
    this.openModal();
  }

  onDelete(vehicle: Vehicle) {
    if (
      confirm(`Do you really want to delete the vehicle ${vehicle.brand}?`)
    ) {
      this.delete(vehicle.id);
    }
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.vehicle = new Vehicle();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdVehicle);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdVehicle);
  }

  resetModal() {
    this.modalService.resetModal<Vehicle>(
      this.modalIdVehicle,
      this.vehicle,
      () => new Vehicle(),
      this.timeValueModal
    );
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
