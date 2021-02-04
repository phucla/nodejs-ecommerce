// Standard library
import { Entity, Column, OneToOne, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// External module
import { Address } from '@chanel-store/shared';
import { CsCrudEntity, CsCrudPublishedEntity } from '@chanel-store/core';

// Internal
import { DayOfWeek } from './enums/day-of-week.enum';

/**
 * Define the Store entity
 */
@Entity('Store')
export class Store extends CsCrudPublishedEntity {
  @ApiProperty({
    type: String,
    example: 'Join Store',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: Number,
    example: 123456,
  })
  @Column()
  lat: number;

  @ApiProperty({
    type: Number,
    example: 123456,
  })
  @Column()
  lng: number;

  @ApiProperty({
    type: String,
    example: '12345678',
  })
  @Column()
  phone_number: string;

  @ApiProperty({
    type: String,
    example: 'join@gmail.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Store description',
  })
  @Column()
  description: string;

  @OneToOne(() => Address, (profile) => profile.id)
  store_address_id: Address;
}

/**
 * Define the BusinessHour entity
 */
@Entity('BusinessHour')
export class BusinessHour extends CsCrudEntity {
  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @Column('time')
  open_hour: Date;

  @ApiProperty({
    type: Date,
    example: 'YYYY-MM-DDTHH:MM:SS.mmmZ',
  })
  @Column('time')
  close_hour: Date;

  @ApiProperty({ enum: Object.values(DayOfWeek), example: DayOfWeek.Friday })
  @Column('varchar')
  date_of_week: DayOfWeek;

  @ManyToOne(() => Store, (store) => store.id)
  @Column()
  store_id: Store;
}
