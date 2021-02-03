// Standard library
import { DeepPartial } from 'typeorm';

export interface ICsCrudService<T> {
  find(): Promise<T[]>;
  findWithDeleted(): Promise<T[]>;
  findById(id: number): Promise<T>;
  findOneWithDeleted(id: number): Promise<T>;
  updateById(id: number, entity: DeepPartial<T>): Promise<T>;
  create(entity: DeepPartial<T>): Promise<T>;
  deleteById(id: number): Promise<void>;
  restoreById(id: number): Promise<T>;
}
