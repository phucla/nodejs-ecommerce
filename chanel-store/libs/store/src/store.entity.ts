// Standard library
import { Entity, Column, OneToOne, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// External module
import { Address } from '@chanel-store/customer';
import { CsCrudEntity } from '@chanel-store/core';
import { User } from '@chanel-store/auth';

// Internal
import { DayOfWeek } from './enums/dayOfWeek.enum';

/**
 * Define the Store entity
 */
@Entity('Store')
export class Store extends CsCrudEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  lat: number;

  @ApiProperty()
  @Column()
  lng: number;

  @ApiProperty()
  @Column()
  phone_number: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({
    default: false,
  })
  is_published: boolean;

  @OneToOne(() => Address, (profile) => profile.id)
  store_address_id: Address;
}

/**
 * Define the BusinessHour entity
 */
@Entity('BusinessHour')
export class BusinessHour extends CsCrudEntity {
  @ApiProperty()
  @Column('time')
  open_hour: Date;

  @ApiProperty()
  @Column('time')
  close_hour: Date;

  @ApiProperty({ enum: Object.values(DayOfWeek) })
  @Column()
  date_of_week: DayOfWeek;

  @ManyToOne(() => Store, (store) => store.id)
  @Column()
  store_id: Store;
}

/**
 * Define the ShippingAddress entity
 */
@Entity('ShippingAddress')
export class ShippingAddress extends CsCrudEntity {
  @ManyToOne(() => User, (user) => user.id)
  @Column()
  customer_id: User;

  @OneToOne(() => Address, (address) => address.id)
  @Column()
  address_id: Address;
}
