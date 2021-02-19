import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebuggingStoreDto {
  @ApiProperty({
    description: 'Number store',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberStore: number;
}
