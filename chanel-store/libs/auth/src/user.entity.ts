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
  @ApiProperty()
  @Column('varchar', {
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column('varchar', {
    unique: true,
  })
  user_name: string;

  @ApiProperty()
  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.id)
  profile_id: Profile;

  @ApiProperty({ enum: Object.values(Role) })
  @Column('varchar')
  role: Role;
}
