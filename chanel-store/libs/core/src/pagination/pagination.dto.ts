import { ApiProperty } from '@nestjs/swagger';

export class CsPaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class CsPaginationResultDto<T> extends CsPaginationDto {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  totalCount: number;

  length?: number;
}
