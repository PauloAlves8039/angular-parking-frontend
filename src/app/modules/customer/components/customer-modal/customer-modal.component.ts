import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Customer } from '../../../../core/models/Customer';
import { Address } from '../../../../core/models/Address';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { lastValueFrom } from 'rxjs';
import { AddressService } from '../../../../core/services/address/Address.service';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.component.html',
  styleUrls: ['./customer-modal.component.scss'],
})
export class CustomerModalComponent implements OnInit, OnChanges {
  customers: Customer[] = [];
  addresses: Address[] = [];
  customer: Customer = new Customer();
  timeValueModal: number = 200;
  @Input() isUpdateMode: boolean = false;
  @Input() modalId!: string;
  @Input() customerUpdate!: Customer;
  @Output() customerUpdated = new EventEmitter<void>();

  public modalIdCustomer: string = 'customerModal';

  constructor(
    private customerService: CustomerService,
    private addressService: AddressService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.isUpdateMode && this.customerUpdate) {
      this.customer = { ...this.customerUpdate};
      this.getAll();
      this.getAllAddresses();
    } else {
      this.getAllAddresses();
      this.resetCustomer();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['customerUpdate'] && changes['customerUpdate'].currentValue) {
      this.customer = { ...this.customerUpdate };
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
      const customers = await lastValueFrom(this.customerService.getAll());
      this.addresses = await lastValueFrom(this.addressService.getAll());
      this.customers = customers.map((customer) => {
        const address = this.getAddressById(customer.addressId);
        return { ...customer, address };
      });
    } catch (error) {
      this.notificationService.showError(`Error loading all customers: ${error}`, 'Error');
    }
  }

  async save() {
    try {
      if (this.validateFields()) {
        this.customer.addressId = Number(this.customer.addressId);
        await lastValueFrom(this.customerService.create(this.customer));
        this.resetModal(this.modalIdCustomer);
        this.closeModal(this.modalIdCustomer);
        this.customerUpdated.emit();
        this.notificationService.showSuccess('Customer added successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error adding customer: ${error}`, 'Error');
    }
  }

  async update() {
    try {
      if (this.validateFields()) {
        this.customer.addressId = Number(this.customer.addressId);
        await lastValueFrom(this.customerService.update(this.customer.id, this.customer));
        this.resetModal(this.modalIdCustomer);
        this.closeModal(this.modalIdCustomer);
        this.customerUpdated.emit();
        this.notificationService.showSuccess('Customer updated successfully!', 'Success');
      } else {
        this.notificationService.showWarning('Please fill in all required fields', 'Warning');
      }
    } catch (error) {
      this.notificationService.showError(`Error updating customer: ${error}`, 'Error');
    }
  }

  async getAllAddresses() {
    try {
      this.addresses = await lastValueFrom(this.addressService.getAll());
    } catch (error) {
      this.notificationService.showError(`Error loading all addresses: ${error}`, 'Error');
    }
  }

  getAddressById(addressId: number): Address | undefined {
    const address = this.addresses.find((address) => address.id === addressId);
    return address;
  }

  resetCustomer() {
    this.customer = new Customer();
  }

  resetModal(modalId: string) {
    this.customer = new Customer();
    this.isUpdateMode = false;
    this.onResetModal(modalId, this.customer, () => new Customer(), this.timeValueModal);
  }

  onResetModal(modalId: string, modelInstance: Customer, resetModel: () => Customer, delay: number = 200) {
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
    this.customer = new Customer();
  }

  validateFields(): boolean {
    return (
      !!this.customer.name &&
      !!this.customer.birthDate &&
      !!this.customer.cpf &&
      !!this.customer.phone &&
      !!this.customer.email &&
      !!this.customer.addressId
    );
  }
}
