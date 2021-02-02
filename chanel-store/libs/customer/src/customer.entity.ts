// Standard library
import { Entity, Column, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Internal
import { CsCrudEntity } from '@chanel-store/core';

/**
 * Define the Address entity
 */
@Entity('Address')
export class Address extends CsCrudEntity {
  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  zip_code: string;

  @ApiProperty()
  @Column()
  state: string;
}

/**
 * Define the Profile entity
 */
@Entity('Profile')
export class Profile extends CsCrudEntity {
  @ApiProperty()
  @Column()
  first_name: string;

  @ApiProperty()
  @Column()
  last_name: string;

  @ApiProperty()
  @Column()
  gender: string;

  @ApiProperty()
  @Column()
  phone_number: string;

  @OneToOne(() => Address, (address) => address.id)
  address_id: Address;

  @ApiProperty()
  @Column()
  store_id: string;
}
