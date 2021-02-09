// Standard library
import { DeepPartial } from 'typeorm';
import { Body, Param, Get, Post, Delete, Put } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiBody,
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
    @ApiOperation({
      summary: 'Find a entities',
    })
    @ApiOkResponse({
      description: 'Data for find a entities',
      isArray: true,
      type: Entity,
    })
    async find(): Promise<T[]> {
      return await this.baseCrudEntityService.find();
    }

    @Get(':id')
    @ApiOperation({
      summary: 'Find a entity by id',
    })
    @ApiOkResponse({
      description: 'Data for find a entity',
      isArray: false,
      type: Entity,
    })
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
      type: Entity,
    })
    @ApiBody({
      type: CreateEntityDto,
    })
    async createEntity(@Body() entity: DeepPartial<T>): Promise<T> {
      return this.baseCrudEntityService.create(entity);
    }

    @Put(':id')
    @ApiOperation({
      summary: 'Update a entity',
    })
    @ApiOkResponse({
      description: 'Data for entity update',
      type: Entity,
    })
    @ApiBody({
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
