// Standard library
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

// Internal
import { ICsCrudEntity } from './interface/crud-entity.interface';

/**
 * Define base Crud entity
 */
export abstract class CsCrudEntity implements ICsCrudEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @DeleteDateColumn()
  deleted_at: Date;
}

/**
 * Define base Crud Published entity, the class will add an is_published field to entity
 */

export abstract class CsCrudPublishedEntity extends CsCrudEntity {
  @ApiProperty()
  @Column({
    default: false,
  })
  is_published: boolean;
}
