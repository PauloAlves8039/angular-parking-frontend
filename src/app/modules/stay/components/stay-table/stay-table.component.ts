import { Component, OnInit } from '@angular/core';
import { Stay } from '../../../../core/models/Stay';
import { StayService } from '../../../../core/services/stay/Stay.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { BaseComponent } from '../../../../core/interfaces/base-component/ibase-component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-stay-table',
  templateUrl: './stay-table.component.html',
  styleUrls: ['./stay-table.component.scss'],
})
export class StayTableComponent implements OnInit, BaseComponent<Stay> {
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
    this.getAll();
  }

  async getAll() {
    try {
      const stays = await lastValueFrom(this.stayService.getAll());
      this.stays = stays;
      this.filteredStays = [...this.stays];
    } catch (error) {
      console.error(`Error loading all stays: ${error}`);
    }
  }

  async save() {
    try {
      await lastValueFrom(this.stayService.create(this.stay));
      this.getAll();
      this.resetModal();
    } catch (error) {
      console.error(`Error adding stay: ${error}`);
    }
  }

  async update(stay: Stay) {
    try {
      await lastValueFrom(this.stayService.update(stay.id, stay));
      this.getAll();
    } catch (error) {
      console.error(`Error updating stay: ${error}`);
    }
  }

  async delete(id: number) {
    try {
      await lastValueFrom(this.stayService.delete(id));
      this.getAll();
    } catch (error) {
      console.error(`Error deleting stay: ${error}`);
    }
  }

  async onGeneratePdf(stay: Stay) {
    try {
      const pdfBlob: Blob = await lastValueFrom(this.stayService.generatePdf(stay.id));
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Stay.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error generating PDF: ${error}`);
    }
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
    this.getAll();
  }

  onUpdate(stay: Stay) {
    this.isUpdateMode = true;
    this.stay = { ...stay };
    this.update(stay);
  }

  onDelete(stay: Stay) {
    if (confirm(`Do you really want to exclude stay ${stay.licensePlate}?`)) {
      this.delete(stay.id);
    }
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
