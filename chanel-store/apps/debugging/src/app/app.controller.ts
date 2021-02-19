// Standard library
import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { Body } from '@nestjs/common';

// External module
import { Store } from '@chanel-store/store';

// Internal module
import { AppService } from './app.service';
import { CreateDebuggingStoreDto } from './app.dto';

@Controller('debugging')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-store')
  @ApiBody({
    type: CreateDebuggingStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully created.',
    isArray: true,
    type: Store,
  })
  async createStores(
    @Body(new DefaultValuePipe(1), ParseIntPipe) numberStore: number
  ): Promise<Store[]> {
    return this.appService.createStores(numberStore);
  }
}
