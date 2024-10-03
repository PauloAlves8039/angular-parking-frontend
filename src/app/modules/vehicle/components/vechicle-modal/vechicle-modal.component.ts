import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Vehicle } from '../../../../core/models/Vehicle';
import { VehicleService } from '../../../../core/services/vehicle/Vehicle.service';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-vechicle-modal',
  templateUrl: './vechicle-modal.component.html',
  styleUrls: ['./vechicle-modal.component.scss'],
})
export class VechicleModalComponent implements OnInit, OnChanges {
  vehicle: Vehicle = new Vehicle();
  timeValueModal: number = 200;
  @Input() isUpdateMode: boolean = false;
  @Input() modalId!: string;
  @Input() vehicleUpdate!: Vehicle;
  @Output() vehicleUpdated = new EventEmitter<void>();

  public modalIdVehicle: string = 'vehicleModal';

  constructor(
    private vehicleService: VehicleService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.isUpdateMode && this.vehicleUpdate) {
      this.vehicle = { ...this.vehicleUpdate };
    } else {
      this.resetVehicle();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicleUpdate'] && changes['vehicleUpdate'].currentValue) {
      this.vehicle = { ...this.vehicleUpdate };
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

  async save() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.vehicleService.create(this.vehicle));
        this.resetModal(this.modalIdVehicle);
        this.closeModal(this.modalIdVehicle);
        this.vehicleUpdated.emit();
        this.notificationService.showSuccess('Vehicle added successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error adding vehicle: ${error}`, 'Error');
    }
  }

  async update() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.vehicleService.update(this.vehicle.id, this.vehicle));
        this.resetModal(this.modalIdVehicle);
        this.closeModal(this.modalIdVehicle);
        this.vehicleUpdated.emit();
        this.notificationService.showSuccess('Vehicle updated successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error updating Vehicle: ${error}`, 'Error');
    }
  }

  resetVehicle() {
    this.vehicle = new Vehicle();
  }

  resetModal(modalId: string) {
    this.vehicle = new Vehicle();
    this.isUpdateMode = false;
    this.onResetModal(modalId, this.vehicle, () => new Vehicle(), this.timeValueModal);
  }

  onResetModal(modalId: string, modelInstance: Vehicle, resetModel: () => Vehicle, delay: number = 200) {
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
    this.vehicle = new Vehicle();
  }

  validateFields(): boolean {
    return (
      !!this.vehicle.vehicleType &&
      !!this.vehicle.brand &&
      !!this.vehicle.model &&
      !!this.vehicle.color &&
      !!this.vehicle.vehicleYear
    );
  }
}
