// Standard library
import {
  IsNotEmpty,
  ValidatorConstraint,
  IsString,
  IsArray,
  ValidatorConstraintInterface,
  Validate,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// External module
import {
  CreateStoreDTO,
  IBusinessHourDto,
  DayOfWeek,
} from '@chanel-store/store';

@ValidatorConstraint()
export class BusinessHourLength<T> implements ValidatorConstraintInterface {
  validate(value: Array<T>) {
    return value && value.length === 7;
  }

  defaultMessage() {
    return 'businessHours must be equal to 7';
  }
}

export class CreateBusinessHourDto implements IBusinessHourDto {
  @ApiProperty({
    description: 'Open Hour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  open_hour: string;

  @ApiProperty({
    description: 'Close Hour',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  close_hour: string;

  @ApiProperty({
    description: 'Day of week',
    enum: Object.values(DayOfWeek),
  })
  @IsNotEmpty()
  @IsString()
  date_of_week: DayOfWeek;
}

export class CreateStoreDto extends CreateStoreDTO {
  @ApiProperty({
    description: 'Business Hours',
    required: true,
    isArray: true,
  })
  @Validate(BusinessHourLength)
  @IsNotEmpty()
  @IsArray()
  business_hours: CreateBusinessHourDto[];
}

export class PublishStoreDto {
  @ApiProperty({
    description: 'Publish or Unpublish Store',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_published: boolean;
}

export class UpdateBusinessHourDto extends PartialType(CreateBusinessHourDto) {
  @ApiProperty({
    description: 'Business Hour Id',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class UpdateStoreDto extends PartialType(CreateStoreDTO) {
  @ApiProperty({
    description: 'Business Hours',
    required: true,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @Validate(BusinessHourLength)
  business_hours: UpdateBusinessHourDto[];
}
