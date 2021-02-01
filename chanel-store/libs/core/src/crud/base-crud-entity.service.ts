// Standard library
import { NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';

// Internal
import { BaseCrudEntity } from './base-crud.entity';
import { IBaseCrudService } from './interface/IBaseCrudService';

export abstract class BaseCrudEntityService<T extends BaseCrudEntity>
  implements IBaseCrudService<T> {
  constructor(private repository: Repository<T>) {}

  async find(): Promise<T[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<T> {
    const entiry = await this.repository.findOne({ where: { id } });

    if (entiry) {
      return entiry;
    }

    throw new NotFoundException();
  }

  async updateById(id: number, entity: DeepPartial<T>): Promise<T> {
    await this.findById(id);
    const updateEntity = Object.assign({}, entity);

    await this.repository.save(updateEntity);
    return this.findById(id);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    delete entity.id;
    return await this.repository.save(entity);
  }

  async deleteById(id: number): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
    return;
  }
}
