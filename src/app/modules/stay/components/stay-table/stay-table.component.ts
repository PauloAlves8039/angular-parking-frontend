import { Component, OnInit } from '@angular/core';
import { Stay } from '../../../../core/models/Stay';
import { StayService } from '../../../../core/services/stay/Stay.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';

@Component({
  selector: 'app-stay-table',
  templateUrl: './stay-table.component.html',
  styleUrls: ['./stay-table.component.scss'],
})
export class StayTableComponent implements OnInit {
  stays: Stay[] = [];
  filteredStays: Stay[] = [];
  stay: Stay = new Stay();
  isUpdateMode: boolean = false;
  timeValueModal: number = 200;
  searchTerm: string = '';

  columns = [
    { key: 'customerVehicleId', header: 'Cliente' },
    { key: 'licensePlate', header: 'Placa' },
    { key: 'entryDate', header: 'Entrada' },
    { key: 'exitDate', header: 'Saída' },
    { key: 'hourlyRate', header: 'Taxa por Hora' },
    { key: 'totalAmount', header: 'Total' },
    { key: 'stayStatus', header: 'Estado' },
  ];

  private modalIdStay: string = 'stayModal';

  constructor(
    private stayService: StayService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAllStays();
  }

  onUpdate(stay: Stay) {
    this.isUpdateMode = true;
    this.stay = { ...stay };
    this.update(stay);
  }

  onDelete(stay: Stay) {
    if (confirm(`Você realmente deseja excluir a permanência ${stay.licensePlate}?`)) {
      this.delete(stay.id);
    }
  }

  onGeneratePdf(stay: Stay) {
    this.stayService.generatePdf(stay.id).subscribe(
      (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Stay.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error(`Erro ao gerar PDF: ${error}`);
      }
    );
  }

  getAllStays() {
    this.stayService.getAll().subscribe(
      (stays) => {
        this.stays = stays;
        this.filteredStays = [...this.stays];
      },
      (error) => {
        console.error(`Erro ao carregar todas as Permanências: ${error}`);
      }
    );
  }

  searchStays() {
    if (this.searchTerm.trim() !== '') {
      this.filteredStays = this.stays.filter(
        (stay: Stay) =>
          stay.licensePlate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          stay.stayStatus.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredStays = [...this.stays];
    }
  }

  clearSearchField() {
    this.searchTerm = '';
    this.getAllStays();
  }

  save() {
    this.stayService.create(this.stay).subscribe(
      (response) => {
        this.getAllStays();
        this.resetModal();
      },
      (error) => {
        console.error(`Erro ao adicionar permanência: ${error}`);
      }
    );
  }

  update(stay: Stay) {
    this.stayService.update(stay.id, stay).subscribe(
      (response) => {
        this.getAllStays();
      },
      (error) => {
        console.error(`Erro ao atualizar permanência: ${error}`);
      }
    );
  }

  delete(id: number) {
    this.stayService.delete(id).subscribe(
      () => {
        this.getAllStays();
      },
      (error) => {
        console.error(`Erro ao excluir permanência: ${error}`);
      }
    );
  }

  openCreateModal() {
    this.isUpdateMode = false;
    this.stay = new Stay();
    this.openModal();
  }

  openModal() {
    this.modalService.openModal(this.modalIdStay);
  }

  closeModal() {
    this.modalService.closeModal(this.modalIdStay);
  }

  resetModal() {
    this.modalService.resetModal<Stay>(
      this.modalIdStay,
      this.stay,
      () => new Stay(),
      this.timeValueModal
    );
  }
}
