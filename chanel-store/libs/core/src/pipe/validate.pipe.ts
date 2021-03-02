// Standard library
import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidatePipe<T> implements PipeTransform {
  async transform(value: T, { metatype }: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors: ValidationError[] = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: this.buildError(errors),
        },
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private buildError(errors: ValidationError[]) {
    const result = {};
    errors.forEach((element) => {
      const prop = element.property;
      Object.entries(element.constraints).forEach((constraint) => {
        result[prop + constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }
}
