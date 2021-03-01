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

// External libs
import { LoggingInterceptor, ValidatePipe } from '@chanel-store/core';
import { User } from '@chanel-store/shared';

// Internal module
import { AppService } from './app.service';
import { Role } from '@chanel-store/shared';
import { CreateStoreDto, UpdateStoreDto } from './app.dto';

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
    type: User,
  })
  createStore(@Body(new ValidatePipe()) body: CreateStoreDto) {
    return this.appService.createStore(body);
  }

  @ApiTags('Store')
  @Get('store')
  @ApiBody({
    type: CreateStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully created.',
    type: User,
  })
  getStore() {
    return this.appService.getStores();
  }

  /**
   * Admin Archive or Unarchive store
   * @param id
   * @param body
   */
  @ApiTags('Store')
  @Put('store/:id')
  @ApiBody({
    type: UpdateStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully created.',
    type: User,
  })
  updateStore(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: number,
    @Body(new ValidatePipe()) body: UpdateStoreDto
  ) {
    return this.appService.updateStore(id, body);
  }
}
