import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebuggingStoreDto {
  @ApiProperty({
    description: 'Number of Store',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberStore: number;
}

export class CreateDebuggingUserDto {
  @ApiProperty({
    description: 'Number of User',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberUser: number;
}
