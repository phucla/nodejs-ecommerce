// Standard library
import {
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

// External module
import { Address } from '@chanel-store/shared';
import { CsCrudEntity, CsCrudPublishedEntity } from '@chanel-store/core';
import { Profile } from '@chanel-store/customer';
import { Category } from '@chanel-store/product';

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
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  lat: string;

  @ApiProperty({
    type: String,
    example: '123456',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  lng: string;

  @ApiProperty({
    type: String,
    example: '12345678',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    type: String,
    example: 'join@gmail.com',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: 'Store description',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @OneToOne(() => Address)
  @JoinColumn()
  @IsNotEmpty()
  store_address: Address;

  @OneToMany(() => Profile, (profile) => profile.store)
  profiles: Profile[];

  @OneToMany(() => BusinessHour, (businessHour) => businessHour.store)
  business_hours: BusinessHour[];

  @OneToMany(() => Category, (category) => category.store)
  categories: Category[];
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

  @ManyToOne(() => Store, (store) => store.business_hours)
  store: Store;
}
