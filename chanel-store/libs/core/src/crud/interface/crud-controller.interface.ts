// Standard library
import { DeepPartial } from 'typeorm';

export interface ICsCrudController<T> {
  find(req: any): Promise<T[]>;
  findWithDeleted(): Promise<T[]>;
  findEntityWithDeleted(id: number): Promise<T>;
  findEntityById(id: number, req: any): Promise<T>;
  deleteEntityById(id: number, req: any): Promise<void>;
  createEntity(entity: DeepPartial<T>, req: any): Promise<T>;
  updateEntityById(id: number, entity: DeepPartial<T>, req: any): Promise<T>;
  restoreEntityById(id: number, req: any): Promise<T>;
}
