import { Component, OnInit } from '@angular/core';
import { Address } from '../../../../core/models/Address';
import { AddressService } from '../../../../core/services/address/Address.service';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.scss'],
})
export class AddressTableComponent implements OnInit {
  addresses: Address[] = [];
  filteredAddresses: any[] = [];
  pagedAddresses: Address[] = [];
  address: Address = new Address();
  isUpdateMode: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private addressService: AddressService,
    private notificationService: NotificationService
  ) {}

  public modalIdAddress: string = 'addressModal';

  ngOnInit() {
    this.getAll();
  }

  async getAll() {
    try {
      const addresses = await lastValueFrom(this.addressService.getAll());
      this.addresses = addresses;
      this.filteredAddresses = [...this.addresses];
      this.updatePagination();
    } catch (error) {
      this.notificationService.showError(`Error loading all addresses: ${error}`, 'Error');
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.addressService.delete(id));
      this.getAll();
      this.notificationService.showSuccess('Address deleted successfully!', 'Success');
    } catch (error) {
      this.notificationService.showError(`Error deleting address: ${error}`, 'Error');
    }
  }

  searchAddresses() {
    if (this.searchTerm.trim() !== '') {
      this.filteredAddresses = this.addresses.filter(
        (address: Address) =>
          address.street.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          address.zipCode.includes(this.searchTerm)
      );
    } else {
      this.filteredAddresses = [...this.addresses];
    }
    this.updatePagination();
  }

  openModal(modalId: string, isUpdateMode: boolean = false) {
    this.isUpdateMode = isUpdateMode;
    if (!isUpdateMode) {
      this.address = new Address();
    }
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }

  onUpdate(address: Address) {
    this.address = { ...address };
    this.openModal(this.modalIdAddress, true);
  }

  onDelete(address: Address) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the address ${address.street}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00BFFF',
      cancelButtonColor: '#FF4500',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.delete(address.id);
        Swal.fire('Deleted!', 'The address has been deleted.', 'success');
      }
    });
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAll();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredAddresses.length / this.itemsPerPage);
    this.pagedAddresses = this.filteredAddresses.slice(
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
