// Standard library
import { DeepPartial } from 'typeorm';
import { Body, Param, Get, Post, Delete, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiFoundResponse,
} from '@nestjs/swagger';

// Internal
import { ICsCrudController } from './interface/crud-controller.interface';
import { CsCrudEntityService } from './crud-entity.service';
import { CsCrudEntity } from './crud.entity';
import { filterMetadata } from '../utils/filter-metadata-factory';

/**
 * Define function to create core crud controller
 * @param Entity
 * @param EntityUpdateDto
 */
export function getCsCrudController<T extends CsCrudEntity>(
  Entity: { new (): T },
  EntityUpdateDto: { new (): any }
) {
  // Define CreateEntityDto
  const CreateEntityDto = filterMetadata(
    Entity,
    'swagger/apiModelPropertiesArray',
    [':id', ':created_at', ':updated_at', ':deleted_at'],
    `${Entity.name}CreateDTO`
  );

  /**
   * Define abstract class  Crud entity controller
   */
  @ApiTags(Entity.name)
  abstract class CsCrudEntityController implements ICsCrudController<T> {
    constructor(private baseCrudEntityService: CsCrudEntityService<T>) {}

    @Get()
    async find(): Promise<T[]> {
      return await this.baseCrudEntityService.find();
    }

    @Get()
    async findWithDeleted(): Promise<T[]> {
      return await this.baseCrudEntityService.findWithDeleted();
    }

    @Get(':id')
    async findEntityWithDeleted(@Param(':id') id: number): Promise<T> {
      return this.baseCrudEntityService.findOneWithDeleted(id);
    }

    @Get(':id')
    async findEntityById(@Param(':id') id: number): Promise<T> {
      return this.baseCrudEntityService.findById(id);
    }

    @Delete(':id')
    async deleteEntityById(@Param(':id') id: number): Promise<void> {
      return this.baseCrudEntityService.deleteById(id);
    }

    @Post()
    @ApiOperation({
      summary: 'Create a entity',
    })
    @ApiCreatedResponse({
      description: 'Data for entity creation',
      isArray: false,
      type: CreateEntityDto,
    })
    async createEntity(@Body() entity: DeepPartial<T>): Promise<T> {
      return this.baseCrudEntityService.create(entity);
    }

    @Put(':id')
    @ApiOperation({
      summary: 'Update a entity',
    })
    @ApiFoundResponse({
      description: 'Data for entity update',
      type: EntityUpdateDto,
    })
    async updateEntityById(
      @Param(':id') id: number,
      @Body() entity: DeepPartial<T>
    ): Promise<T> {
      return this.baseCrudEntityService.updateById(id, entity);
    }
  }

  return CsCrudEntityController;
}
