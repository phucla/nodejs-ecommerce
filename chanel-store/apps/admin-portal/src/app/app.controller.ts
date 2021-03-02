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
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from '@chanel-store/auth';
import { DeepPartial } from 'typeorm';

// External libs
import { LoggingInterceptor, ValidatePipe } from '@chanel-store/core';

// Internal module
import { AppService } from './app.service';
import { Role } from '@chanel-store/shared';
import { CreateStoreDto, PublishStoreDto, UpdateStoreDto } from './app.dto';
import { Store } from '@chanel-store/store';

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
  @ApiOkResponse({
    type: Store,
    isArray: true,
  })
  getStores(): Promise<Store[]> {
    return this.appService.getStores();
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
  archiveStore(
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
