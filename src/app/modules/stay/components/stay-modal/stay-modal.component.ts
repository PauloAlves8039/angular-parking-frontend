import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Stay } from '../../../../core/models/Stay';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { StayService } from '../../../../core/services/stay/Stay.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-stay-modal',
  templateUrl: './stay-modal.component.html',
  styleUrls: ['./stay-modal.component.scss'],
})
export class StayModalComponent implements OnInit, OnChanges {
  stay: Stay = new Stay();
  stays: Stay[] = [];
  customerVehicleDetails: any[] = [];
  timeValueModal: number = 200;
  @Input() isUpdateMode: boolean = false;
  @Input() modalId!: string;
  @Input() stayUpdate!: Stay;
  @Output() stayUpdated = new EventEmitter<void>();

  public modalIdStay: string = 'stayModal';

  constructor(
    private stayService: StayService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.isUpdateMode && this.stayUpdate) {
      this.stay = { ...this.stayUpdate};
      this.getAll();
      this.getCustomerVehicleDetails();
    }else {
      this.getCustomerVehicleDetails();
      this.resetStay();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stayUpdate'] && changes['stayUpdate'].currentValue) {
      this.stay = { ...this.stayUpdate };
      this.cdr.detectChanges();
    }
  }

  async getAll() {
    try {
      const stays = await lastValueFrom(this.stayService.getAll());
      this.stays = stays;
    } catch (error) {
      this.notificationService.showError(`Error loading all stays: ${error}`, 'Error');
    }
  }

  async save() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.stayService.create(this.stay));
        this.resetModal(this.modalIdStay);
        this.closeModal(this.modalIdStay);
        this.stayUpdated.emit();
        this.notificationService.showSuccess('Stay added successfully!','Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error adding stay: ${error}`, 'Error');
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

  resetStay() {
    this.stay = new Stay();
  }

  resetModal(modalId: string) {
    this.stay = new Stay();
    this.isUpdateMode = false;
    this.onResetModal(modalId, this.stay, () => new Stay(), this.timeValueModal);
  }

  onResetModal(modalId: string, modelInstance: Stay, resetModel: () => Stay, delay: number = 200) {
    modelInstance = resetModel();
    setTimeout(() => this.closeModal(modalId), delay);
  }

  clearModalFields(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.stay = new Stay();
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
    }
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
