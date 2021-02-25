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

export class CreateDebuggingCategoryDto {
  @ApiProperty({
    description: 'Number of Category',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberCategory: number;

  @ApiProperty({
    description: 'Store Id',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  storeId: number;

  @ApiProperty({
    description: 'Parent Id',
    required: false,
  })
  @IsInt()
  parentId: number;
}

export class CreateDebuggingStoreManagerDto {
  @ApiProperty({
    description: 'Number of Store Manager',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberManager: number;

  @ApiProperty({
    description: 'Store Id',
    required: false,
  })
  @IsNotEmpty()
  @IsInt()
  storeId?: number;
}

export class CreateDebuggingOrderDto {
  @ApiProperty({
    description: 'Number of Order',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberOrder: number;

  @ApiProperty({
    description: 'Customer id',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  customerId?: number;
}

export class CreateDebuggingProductDto {
  @ApiProperty({
    description: 'Number of Product',
    default: 1,
  })
  @IsNotEmpty()
  @IsInt()
  numberProduct: number;

  @ApiProperty({
    description: 'Store id',
  })
  @IsNotEmpty()
  @IsInt()
  storeId?: number;
}
