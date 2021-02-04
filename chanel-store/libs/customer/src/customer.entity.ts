// Standard library
import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Internal
import { CsCrudEntity } from '@chanel-store/core';
import { Gender } from './enums/gender.enum';
import { Store } from '@chanel-store/store';
import { Address } from '@chanel-store/shared';

/**
 * Define the Profile entity
 */
@Entity('Profile')
export class Profile extends CsCrudEntity {
  @ApiProperty({
    type: String,
    example: 'Join',
  })
  @Column()
  first_name: string;

  @ApiProperty({
    type: String,
    example: 'Stone',
  })
  @Column()
  last_name: string;

  @ApiProperty({ enum: Object.values(Gender), example: Gender.Female })
  @Column('varchar')
  gender: Gender;

  @ApiProperty({
    type: String,
    example: '231234512345',
  })
  @Column()
  phone_number: string;

  @OneToOne(() => Address, (address) => address.id)
  @ApiProperty({
    type: Address,
    example: 1,
  })
  address_id: Address;

  @ApiProperty({
    type: Store,
    example: 1,
  })
  @OneToMany(() => Store, (store) => store.id)
  @Column()
  store_id: Store;
}
