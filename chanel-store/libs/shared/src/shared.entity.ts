// Standard library
import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// External module
import { CsCrudEntity } from '@chanel-store/core';

// Internal
import { Role } from './enums/role.enum';

/**
 * Define the User entity
 */
@Entity('User')
export class User extends CsCrudEntity {
  @ApiProperty({
    type: String,
    example: 'example@email.com',
    required: true,
  })
  @Column('varchar', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'username',
    required: true,
  })
  @Column('varchar', {
    unique: true,
  })
  user_name: string;

  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    type: Role,
    enum: Object.values(Role),
    example: Role.StoreManager,
  })
  @Column('varchar')
  role: Role;

  @OneToMany(() => ShippingAddress, (shippingAddress) => shippingAddress.id, {
    cascade: true,
  })
  shippingAddress: ShippingAddress[];
}

/**
 * Define the Address entity
 */
@Entity('Address')
export class Address extends CsCrudEntity {
  @ApiProperty({
    type: String,
    example: '123 apt, New York',
  })
  @Column()
  address: string;

  @ApiProperty({
    type: String,
    example: 'New York',
  })
  @Column()
  city: string;

  @ApiProperty({
    type: String,
    example: '012345',
  })
  @Column({
    length: 6,
  })
  zip_code: string;

  @ApiProperty({
    type: String,
    example: 'NY',
  })
  @Column()
  state: string;
}

/**
 * Define the ShippingAddress entity
 */
@Entity('ShippingAddress')
export class ShippingAddress extends CsCrudEntity {
  @ManyToOne(() => User, (user) => user.shippingAddress)
  user: User;

  @OneToOne(() => Address)
  @JoinColumn()
  address: Address;
}
