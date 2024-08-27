import { Component, OnInit } from '@angular/core';
import { CustomerVehicle } from '../../../../core/models/CustomerVehicle';
import { CustomerVehicleService } from '../../../../core/services/customer-vehicle/CustomerVehicle.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';

@Component({
  selector: 'app-customer-vehicle-table',
  templateUrl: './customer-vehicle-table.component.html',
  styleUrls: ['./customer-vehicle-table.component.scss'],
})
export class CustomerVehicleTableComponent implements OnInit {
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
    this.getAllCustomerVehicle();
  }

  onUpdate(customerVehicle: CustomerVehicle) {
    this.isUpdateMode = true;
    this.customerVehicle = { ...customerVehicle };
    this.openModal();
  }

  onDelete(customerVehicle: CustomerVehicle) {
    if (confirm(`Você realmente deseja excluir o cliente e veículo associado?`)) {
      this.delete(customerVehicle.id);
    }
  }

  getAllCustomerVehicle() {
    this.customerVehicleService.getAll().subscribe(
      (customersVehicles) => {
        this.customersVehicles = customersVehicles;
        this.filteredCustomerVehicle = [...this.customersVehicles];
      },
      (error) => {
        console.error(`Erro ao carregar todos os clientes e veículos associados: ${error}`);
      }
    );
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
    this.getAllCustomerVehicle();
  }

  saveOrUpdate() {
    if (this.isUpdateMode) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    this.customerVehicleService.create(this.customerVehicle).subscribe(
      (response) => {
        this.getAllCustomerVehicle();
        this.resetModal();
      },
      (error) => {
        console.error(
          `Erro ao adicionar cliente e veículo associado: ${error}`
        );
      }
    );
  }

  update() {
    this.customerVehicleService
      .update(this.customerVehicle.id, this.customerVehicle)
      .subscribe(
        (response) => {
          this.getAllCustomerVehicle();
          this.resetModal();
        },
        (error) => {
          console.error(
            `Erro ao atualizar cliente e veículo associado: ${error}`
          );
        }
      );
  }

  delete(id: number) {
    this.customerVehicleService.delete(id).subscribe(
      () => {
        this.getAllCustomerVehicle();
      },
      (error) => {
        console.error(`Erro ao excluir cliente e veículo associado: ${error}`);
      }
    );
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
