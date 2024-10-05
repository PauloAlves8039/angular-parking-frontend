import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomerVehicle } from '../../../../core/models/CustomerVehicle';
import { Customer } from '../../../../core/models/Customer';
import { Vehicle } from '../../../../core/models/Vehicle';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { CustomerVehicleService } from '../../../../core/services/customer-vehicle/CustomerVehicle.service';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-customer-vehicle-modal',
  templateUrl: './customer-vehicle-modal.component.html',
  styleUrls: ['./customer-vehicle-modal.component.scss'],
})
export class CustomerVehicleModalComponent implements OnInit, OnChanges {
  customerVehicle: CustomerVehicle = new CustomerVehicle();
  customersVehicles: CustomerVehicle[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  timeValueModal: number = 200;
  @Input() isUpdateMode: boolean = false;
  @Input() modalId!: string;
  @Input() customerVehicleUpdate!: CustomerVehicle;
  @Output() customerVehicleUpdated = new EventEmitter<void>();

  public modalIdcustomerVehicle: string = 'customerVehicleModal';

  constructor(
    private customerVehicleService: CustomerVehicleService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    if (this.isUpdateMode && this.customerVehicleUpdate) {
      this.customerVehicle = { ...this.customerVehicleUpdate};
      this.getAll();
      this.getCustomersAndVehicles();
    } else {
      this.getCustomersAndVehicles();
      this.resetCustomerVehicle();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerVehicleUpdate'] && changes['customerVehicleUpdate'].currentValue) {
      this.customerVehicle = { ...this.customerVehicleUpdate };
      this.cdr.detectChanges();
    }
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
    } catch (error) {
      this.notificationService.showError(`Error loading all customers and associated vehicles: ${error}`, 'Error');
    }
  }

  async save() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.customerVehicleService.create(this.customerVehicle));
        this.resetModal(this.modalIdcustomerVehicle);
        this.closeModal(this.modalIdcustomerVehicle);
        this.customerVehicleUpdated.emit();
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
        this.resetModal(this.modalIdcustomerVehicle);
        this.closeModal(this.modalIdcustomerVehicle);
        this.customerVehicleUpdated.emit();
        this.notificationService.showSuccess('Association updated successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error updating association: ${error}`, 'Error');
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

  resetCustomerVehicle() {
    this.customerVehicle = new CustomerVehicle();
  }

  resetModal(modalId: string) {
    this.customerVehicle = new CustomerVehicle();
    this.isUpdateMode = false;
    this.onResetModal(modalId, this.customerVehicle, () => new CustomerVehicle(), this.timeValueModal);
  }

  onResetModal(modalId: string, modelInstance: CustomerVehicle, resetModel: () => CustomerVehicle, delay: number = 200) {
    modelInstance = resetModel();
    setTimeout(() => this.closeModal(modalId), delay);
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
    }
  }

  clearModalFields(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.customerVehicle = new CustomerVehicle();
  }

  validateFields(): boolean {
    return (
      !!this.customerVehicle.customerId &&
      !!this.customerVehicle.vehicleId
    );
  }
}
