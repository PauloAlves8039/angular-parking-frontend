import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../../../../core/models/Vehicle';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-vehicle-table',
  templateUrl: './vehicle-table.component.html',
  styleUrls: ['./vehicle-table.component.scss'],
})
export class VehicleTableComponent implements OnInit {
  vehicles: Vehicle[] = [];
  filteredVehicles: any[] = [];
  vehicle: Vehicle = new Vehicle();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'vehicleType', header: 'Tipo' },
    { key: 'brand', header: 'Marca' },
    { key: 'model', header: 'Modelo' },
    { key: 'color', header: 'Cor' },
    { key: 'vehicleYear:', header: 'Ano' },
    { key: 'notes', header: 'Observações' },
  ];

  private modalIdVehicle: string = 'vehicleModal';

  constructor(
    private vehicleService: VehicleService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAllVehicles();
  }

  onUpdate(vehicle: Vehicle) {
    this.isUpdateMode = true;
    this.vehicle = { ...vehicle };
    this.openModal();
  }

  onDelete(vehicle: Vehicle) {
    if (
      confirm(`Você realmente deseja excluir o veículo ${vehicle.brand}?`)
    ) {
      this.delete(vehicle.id);
    }
  }

  getAllVehicles() {
    this.vehicleService.getAll().subscribe(
      (vehicles) => {
        this.vehicles = vehicles;
        this.filteredVehicles = [...this.vehicles];
        console.log(this.vehicles);

      },
      (error) => {
        console.error(`Erro ao carregar todos os veículos: ${error}`);
      }
    );
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
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAllVehicles();
  }

  saveOrUpdate() {
    if (this.isUpdateMode) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    this.vehicleService.create(this.vehicle).subscribe(
      (response) => {
        this.getAllVehicles();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao adicionar veículo: ${error}`);
      }
    );
  }

  update() {
    this.vehicleService.update(this.vehicle.id, this.vehicle).subscribe(
      (response) => {
        this.getAllVehicles();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao atualizar veículo: ${error}`);
      }
    );
  }

  delete(id: number) {
    this.vehicleService.delete(id).subscribe(
      () => {
        this.getAllVehicles();
      },
      (error) => {
        console.error(`Erro ao excluir veículo: ${error}`);
      }
    );
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
}
