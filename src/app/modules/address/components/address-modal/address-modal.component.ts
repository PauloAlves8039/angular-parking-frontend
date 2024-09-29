import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CheckZipCodeService } from '../../../../shared/services/check-zip-code/CheckZipCode.service';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { AddressService } from '../../../../core/services/address/Address.service';
import { Address } from '../../../../core/models/Address';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss'],
})
export class AddressModalComponent implements OnInit, OnChanges {
  addresses: Address[] = [];
  address: Address = new Address();
  timeValueModal: number = 200;
  @Input() isUpdateMode: boolean = false;
  @Input() modalId!: string;
  @Input() addressUpdate!: Address;
  @Output() addressUpdated = new EventEmitter<void>();

  states = [
    { acronym: 'AC' }, { acronym: 'AL' }, { acronym: 'AP' }, { acronym: 'AM' },
    { acronym: 'BA' }, { acronym: 'CE' }, { acronym: 'DF' }, { acronym: 'ES' },
    { acronym: 'GO' }, { acronym: 'MA' }, { acronym: 'MT' }, { acronym: 'MS' },
    { acronym: 'MG' }, { acronym: 'PA' }, { acronym: 'PB' }, { acronym: 'PR' },
    { acronym: 'PE' }, { acronym: 'PI' }, { acronym: 'RJ' }, { acronym: 'RN' },
    { acronym: 'RS' }, { acronym: 'RO' }, { acronym: 'RR' }, { acronym: 'SC' },
    { acronym: 'SP' }, { acronym: 'SE' }, { acronym: 'TO' }
  ];

  public modalIdAddress: string = 'addressModal';

  constructor(
    private addressService: AddressService,
    private checkZipCodeService: CheckZipCodeService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.isUpdateMode && this.addressUpdate) {
      this.address = { ...this.addressUpdate };
    } else {
      this.resetAddress();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['addressUpdate'] && changes['addressUpdate'].currentValue) {
      this.address = { ...this.addressUpdate };
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
        await lastValueFrom(this.addressService.create(this.address));
        this.resetModal(this.modalIdAddress);
        this.closeModal(this.modalIdAddress);
        this.addressUpdated.emit();
        this.notificationService.showSuccess('Address added successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error adding address: ${error}`, 'Error');
    }
  }

  async update() {
    try {
      if (this.validateFields()) {
        await lastValueFrom(this.addressService.update(this.address.id, this.address));
        this.resetModal(this.modalIdAddress);
        this.closeModal(this.modalIdAddress);
        this.addressUpdated.emit();
        this.notificationService.showSuccess('Address updated successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error updating address: ${error}`, 'Error');
    }
  }

  resetAddress() {
    this.address = new Address();
  }

  async searchZipCode() {
    try {
      const result = await lastValueFrom(this.checkZipCodeService.checkZipCode(this.address.zipCode));
      this.address.street = result.logradouro;
      this.address.neighborhood = result.bairro;
      this.address.city = result.localidade;
      this.address.federativeUnit = result.uf;
      this.address.zipCode = result.cep;
      this.notificationService.showInfo('ZIP code successfully found!', 'Info');
    } catch (error) {
      this.notificationService.showError(`Error searching for ZIP code: ${error}`, 'Error');
    }
  }

  resetModal(modalId: string) {
    this.address = new Address();
    this.isUpdateMode = false;
    this.onResetModal(modalId, this.address, () => new Address(), this.timeValueModal);
  }

  onResetModal(modalId: string, modelInstance: Address, resetModel: () => Address, delay: number = 200) {
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
    this.address = new Address();
  }

  validateFields(): boolean {
    return (
      !!this.address.street &&
      !!this.address.number &&
      !!this.address.neighborhood &&
      !!this.address.federativeUnit &&
      !!this.address.city &&
      !!this.address.zipCode
    );
  }
}
