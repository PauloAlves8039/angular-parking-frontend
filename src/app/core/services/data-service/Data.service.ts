import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ErrorHandler } from '../../utils/ErrorHandler';

@Injectable({
  providedIn: 'root',
})
export class DataService<T> {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject('BASE_API_URL') private url: string
  ) {
    this.baseUrl = url;
  }

  protected get httpClient(): HttpClient {
    return this.http;
  }

  getAll(): Observable<T[]> {
    return this.httpClient
      .get<T[]>(`${this.baseUrl}`)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  getById(id: number): Observable<T> {
    return this.httpClient
      .get<T>(`${this.baseUrl}/${id}`)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  create(entity: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.baseUrl}`, entity)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  update(id: number, entity: T): Observable<T> {
    return this.httpClient
      .put<T>(`${this.baseUrl}/${id}`, entity)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }
}
