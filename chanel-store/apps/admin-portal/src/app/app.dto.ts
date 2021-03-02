import {
  IsNotEmpty,
  ValidatorConstraint,
  IsString,
  IsArray,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateStoreDTO,
  IBusinessHourDto,
  DayOfWeek,
} from '@chanel-store/store';

@ValidatorConstraint()
export class BusinessHourLength<T> implements ValidatorConstraintInterface {
  validate(value: Array<T>, validationArguments: ValidationArguments) {
    return value.length === 7;
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
  @IsNotEmpty()
  @IsArray()
  @Validate(BusinessHourLength)
  businessHours: CreateBusinessHourDto[];
}

export class UpdateStoreDto {
  @ApiProperty({
    description: 'Archive or Unarchive store',
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_published: boolean;
}
