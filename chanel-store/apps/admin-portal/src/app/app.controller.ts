// Standard library
import { Controller, Get, Post, Body, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from '@chanel-store/auth';

// External libs
import { LoggingInterceptor, ValidatePipe } from '@chanel-store/core';
import { User } from '@chanel-store/shared';

// Internal module
import { AppService } from './app.service';
import { Role } from '@chanel-store/shared';
import { CreateStoreDto } from './app.dto';
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
}
