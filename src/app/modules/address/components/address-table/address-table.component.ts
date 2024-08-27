import { Component, OnInit } from '@angular/core';
import { Address } from '../../../../core/models/Address';
import { AddressService } from '../../../../core/services/address/Address.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';

@Component({
  selector: 'app-address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.scss'],
})
export class AddressTableComponent implements OnInit {
  addresses: Address[] = [];
  filteredAddresses: any[] = [];
  address: Address = new Address();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'street', header: 'Logradouro' },
    { key: 'number', header: 'Número' },
    { key: 'complement', header: 'Complemento' },
    { key: 'neighborhood', header: 'Bairro' },
    { key: 'federativeUnit', header: 'Estado' },
    { key: 'city', header: 'Cidade' },
    { key: 'zipCode', header: 'CEP' },
  ];

  private modalIdAddress: string = 'addressModal';

  constructor(
    private addressService: AddressService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAllAddresses();
  }

  onUpdate(address: Address) {
    this.isUpdateMode = true;
    this.address = { ...address };
    this.openModal();
  }

  onDelete(address: Address) {
    if (
      confirm(`Você realmente deseja excluir o endereço ${address.street}?`)
    ) {
      this.delete(address.id);
    }
  }

  getAllAddresses() {
    this.addressService.getAll().subscribe(
      (addresses) => {
        this.addresses = addresses;
        this.filteredAddresses = [...this.addresses];
      },
      (error) => {
        console.error(`Erro ao carregar todos os endereços: ${error}`);
      }
    );
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
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAllAddresses();
  }

  saveOrUpdate() {
    if (this.isUpdateMode) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    this.addressService.create(this.address).subscribe(
      (response) => {
        this.getAllAddresses();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao adicionar endereço: ${error}`);
      }
    );
  }

  update() {
    this.addressService.update(this.address.id, this.address).subscribe(
      (response) => {
        this.getAllAddresses();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao atualizar endereço: ${error}`);
      }
    );
  }

  delete(id: number) {
    this.addressService.delete(id).subscribe(
      () => {
        this.getAllAddresses();
      },
      (error) => {
        console.error(`Erro ao excluir endereços: ${error}`);
      }
    );
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.address = new Address();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdAddress);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdAddress);
  }

  resetModal() {
    this.modalService.resetModal<Address>(
      this.modalIdAddress,
      this.address,
      () => new Address(),
      this.timeValueModal
    );
  }
}
