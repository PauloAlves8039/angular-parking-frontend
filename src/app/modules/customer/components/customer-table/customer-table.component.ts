import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../../core/services/customer/Customer.service';
import { Customer } from '../../../../core/models/Customer';
import { ModalService } from '../../../../shared/services/modal/modal.service';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  customer: Customer = new Customer();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'name', header: 'Nome' },
    { key: 'birthDate', header: 'Data de Nascimento' },
    { key: 'cpf', header: 'CPF' },
    { key: 'phone', header: 'Telefone' },
    { key: 'email', header: 'Email' },
    { key: 'addressId', header: 'Endereço' },
  ];

  private modalIdCustomer: string = 'customerModal';

  constructor(
    private customerService: CustomerService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAllCustomers();
  }

  onUpdate(customer: Customer) {
    this.isUpdateMode = true;
    this.customer = { ...customer };
    this.openModal();
  }

  onDelete(customer: Customer) {
    if (confirm(`Você realmente deseja excluir o cliente ${customer.name}?`)) {
      this.delete(customer.id);
    }
  }

  getAllCustomers() {
    this.customerService.getAll().subscribe(
      (customers) => {
        this.customers = customers;
        this.filteredCustomers = [...this.customers];
      },
      (error) => {
        console.error(`Erro ao carregar todos os clientes: ${error}`);
      }
    );
  }

  searchCustomers() {
    if (this.searchTerm.trim() !== '') {
      this.filteredCustomers = this.customers.filter(
        (customer: Customer) =>
          customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          customer.phone.includes(this.searchTerm) ||
          customer.cpf.includes(this.searchTerm)
      );
    } else {
      this.filteredCustomers = [...this.customers];
    }
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAllCustomers();
  }

  saveOrUpdate() {
    if (this.isUpdateMode) {
      this.update();
    } else {
      this.save();
    }
  }

  save() {
    this.customerService.create(this.customer).subscribe(
      (response) => {
        this.getAllCustomers();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao adicionar cliente: ${error}`);
      }
    );
  }

  update() {
    this.customerService.update(this.customer.id, this.customer).subscribe(
      (response) => {
        this.getAllCustomers();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao atualizar cliente: ${error}`);
      }
    );
  }

  delete(id: number) {
    this.customerService.delete(id).subscribe(
      () => {
        this.getAllCustomers();
      },
      (error) => {
        console.error(`Erro ao excluir cliente: ${error}`);
      }
    );
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.customer = new Customer();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdCustomer);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdCustomer);
  }

  resetModal() {
    this.modalService.resetModal<Customer>(
      this.modalIdCustomer,
      this.customer,
      () => new Customer(),
      this.timeValueModal
    );
  }
}
