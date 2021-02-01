// Standard library
import { DeepPartial } from 'typeorm';

export interface IBaseCrudService<T> {
  find(): Promise<T[]>;
  findById(id: number): Promise<T>;
  updateById(id: number, entity: DeepPartial<T>): Promise<T>;
  create(entity: DeepPartial<T>): Promise<T>;
  deleteById(id: number): Promise<void>;
}
