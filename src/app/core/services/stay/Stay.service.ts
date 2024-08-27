import { Injectable } from '@angular/core';
import { Stay } from '../../models/Stay';
import { DataService } from '../data-service/Data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StayService extends DataService<Stay> {
  private apiUrl: string = 'https://localhost:7199/api/Stay';

  constructor(http: HttpClient) {
    super(http, 'https://localhost:7199/api/Stay');
  }

  generatePdf(id: number) {
    return this.httpClient.get(`${this.apiUrl}/ticket/${id}`, { responseType: 'blob' });
  }
}
