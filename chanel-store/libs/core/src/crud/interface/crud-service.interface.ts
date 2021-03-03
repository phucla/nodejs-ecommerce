// Standard library
import {
  DeepPartial,
  FindManyOptions,
  FindConditions,
  FindOneOptions,
} from 'typeorm';

export interface ICsCrudService<T> {
  find(options?: FindManyOptions<T>): Promise<T[]>;
  findWithDeleted(): Promise<T[]>;
  findById(id: number): Promise<T>;
  findOneWithDeleted(id: number): Promise<T>;
  updateById(id: number, entity: DeepPartial<T>): Promise<T>;
  create(entity: DeepPartial<T>): Promise<T>;
  delete(
    id: number | FindConditions<T>,
    isSoftDelete?: boolean
  ): Promise<boolean>;
  restoreById(id: number): Promise<T>;
  findOne(
    conditions?: FindConditions<T>,
    options?: FindOneOptions<T>
  ): Promise<T>;
  bulkDelete(
    ids?: number[] | FindConditions<T>,
    isSoftDelete?: boolean
  ): Promise<boolean>;
  countRecords(): Promise<number>;
}
