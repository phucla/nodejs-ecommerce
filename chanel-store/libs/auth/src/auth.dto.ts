import { Role } from '@chanel-store/shared';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username account',
    example: 'user01',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password account',
    example: 'abcd123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Role',
    required: true,
    enum: Role,
  })
  @IsNotEmpty()
  @IsString()
  role: Role;
}
