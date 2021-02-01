// Standard library
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Internal
import { IBaseCrudEntity } from './interface/IBaseCrudEntity';

export abstract class BaseCrudEntity implements IBaseCrudEntity {
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
}
