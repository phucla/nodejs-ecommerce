// Standard library
import { DeepPartial } from 'typeorm';
import { Body, Param } from '@nestjs/common';

// Internal
import { ICsCrudController } from './interface/crud-controller.interface';
import { CsCrudEntityService } from './crud-entity.service';
import { CsCrudEntity } from './crud.entity';

export abstract class BaseCrudEntityController<T extends CsCrudEntity>
  implements ICsCrudController<T> {
  constructor(private baseCrudEntityService: CsCrudEntityService<T>) {}

  async find(): Promise<T[]> {
    return await this.baseCrudEntityService.find();
  }

  async findEntityById(@Param(':id') id: number): Promise<T> {
    return this.baseCrudEntityService.findById(id);
  }

  async deleteEntityById(@Param(':id') id: number): Promise<void> {
    return this.baseCrudEntityService.deleteById(id);
  }

  async createEntity(@Body() entity: DeepPartial<T>): Promise<T> {
    return this.baseCrudEntityService.create(entity);
  }

  async updateEntityById(
    @Param(':id') id: number,
    @Body() entity: DeepPartial<T>
  ): Promise<T> {
    return this.baseCrudEntityService.updateById(id, entity);
  }
}
