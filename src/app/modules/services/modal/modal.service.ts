import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor() {}

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modalInstance.show();
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modalInstance.hide();
    }
  }

  resetModal<T>(modalId: string, modelInstance: T, resetModel: () => T, delay: number = 200) {
    modelInstance = resetModel();
    setTimeout(() => this.closeModal(modalId), delay);
  }
}
