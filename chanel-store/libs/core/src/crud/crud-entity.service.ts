// Standard library
import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  Repository,
  FindManyOptions,
  FindConditions,
  FindOneOptions,
} from 'typeorm';

// Internal
import { CsCrudEntity } from './crud.entity';
import { ICsCrudService } from './interface/crud-service.interface';

export abstract class CsCrudEntityService<T extends CsCrudEntity>
  implements ICsCrudService<T> {
  constructor(private repository: Repository<T>) {}

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findWithDeleted(): Promise<T[]> {
    return await this.repository.find({ withDeleted: true });
  }

  async findById(id: number): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } });

    if (entity) {
      return entity;
    }

    throw new NotFoundException();
  }

  async findOne(
    conditions?: FindConditions<T>,
    options?: FindOneOptions<T>
  ): Promise<T> {
    const entity = await this.repository.findOne(conditions, options);

    if (entity) {
      return entity;
    }

    throw new NotFoundException();
  }

  async findOneWithDeleted(id: number): Promise<T> {
    const entiry = await this.repository.findOne({
      where: { id },
      withDeleted: true,
    });

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

  async delete(id?: number | number[] | FindConditions<T>): Promise<void> {
    await this.repository.softDelete(id);
    return;
  }

  async restoreById(id: number): Promise<T> {
    await this.findOneWithDeleted(id);
    await this.repository.restore(id);
    return this.findById(id);
  }

  async bulkDelete(ids?: number | number[] | FindConditions<T>): Promise<void> {
    if (ids) {
      await this.repository.delete(ids);
    } else {
      const entities = await this.find();
      if (!entities.length) return;
      await this.repository.delete(entities.map((item) => item.id));
    }
  }
}
