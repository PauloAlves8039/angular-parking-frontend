export interface BaseComponent<T> {
  getAll(): void;
  save(): void;
  update?(entity?: T): void;
  delete(id: number): void;
}
