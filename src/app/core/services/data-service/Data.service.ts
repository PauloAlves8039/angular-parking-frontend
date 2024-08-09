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

  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.baseUrl}`)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  create(entity: T): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}`, entity)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  update(id: number, entity: T): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}/${id}`, entity)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(ErrorHandler.getErrorMessage));
  }
}
