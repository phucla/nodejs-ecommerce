// Standard library
import { Entity, Column, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// External module
import { CsCrudEntity } from '@chanel-store/core';
import { Profile } from '@chanel-store/customer';

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

  @OneToOne(() => Profile, (profile) => profile.id)
  profile_id: Profile;

  @ApiProperty({
    type: Role,
    enum: Object.values(Role),
    example: Role.StoreManager,
  })
  @Column('varchar')
  role: Role;
}
