// Standard library
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseInterceptors,
  Param,
  ParseIntPipe,
  HttpStatus,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

// External libs
import {
  LoggingInterceptor,
  ValidatePipe,
  CsPaginationResponse,
  CsPaginationResultDto,
} from '@chanel-store/core';
import { Role } from '@chanel-store/shared';
import { Store } from '@chanel-store/store';
import { Roles } from '@chanel-store/auth';

// Internal module
import { AppService } from './app.service';
import { CreateStoreDto, PublishStoreDto, UpdateStoreDto } from './app.dto';

@UseInterceptors(LoggingInterceptor)
@Roles(Role.Admin)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Store')
  @Post('store')
  @ApiBody({
    type: CreateStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully created.',
    type: Store,
  })
  createStore(@Body(new ValidatePipe()) body: CreateStoreDto): Promise<Store> {
    return this.appService.createStore(body);
  }

  @ApiTags('Store')
  @Get('store')
  @CsPaginationResponse(Store)
  getStores(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name: string,
    @Query('city') city: string
  ): Promise<CsPaginationResultDto<Store>> {
    return this.appService.getStores({
      page,
      limit: limit > 10 ? 10 : limit,
      name,
      city,
    });
  }

  /**
   * Admin publish or unpublish store
   * @param id
   * @param body
   */
  @ApiTags('Store')
  @Put('store/:id/publish')
  @ApiBody({
    type: PublishStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully updated.',
  })
  publishStore(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: number,
    @Body(new ValidatePipe()) body: PublishStoreDto
  ): Promise<void> {
    return this.appService.publishStore(id, body);
  }

  /**
   * Get store detail by id
   * @param id
   * @param body
   */
  @ApiTags('Store')
  @Get('store/:id')
  @ApiOkResponse({
    type: Store,
  })
  getStore(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: number
  ): Promise<DeepPartial<Store>> {
    return this.appService.getStoreById(id);
  }

  /**
   * Admin update store
   * @param id
   * @param body
   */
  @ApiTags('Store')
  @Put('store/:id')
  @ApiBody({
    type: UpdateStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully updated.',
  })
  updateStore(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: number,
    @Body(new ValidatePipe()) body: UpdateStoreDto
  ): Promise<void> {
    return this.appService.updateStore(id, body);
  }
}
