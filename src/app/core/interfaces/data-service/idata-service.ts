import { Observable } from "rxjs";

export interface IDataService<T> {
  getAll(): Observable<T[]>;
  getById(id: number): Observable<T>;
  create(entity: T): Observable<T>;
  update(id: number, entity: T): Observable<T>;
  delete(id: number): Observable<void>;
}
