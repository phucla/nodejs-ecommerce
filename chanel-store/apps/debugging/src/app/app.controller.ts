// Standard library
import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common';

// External module
import { Store } from '@chanel-store/store';
import { User } from '@chanel-store/shared';

// Internal module
import { AppService } from './app.service';
import { CreateDebuggingStoreDto, CreateDebuggingUserDto } from './app.dto';

@Controller('debugging')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Store')
  @Post('create-store')
  @ApiBody({
    type: CreateDebuggingStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully created.',
    isArray: true,
    type: Store,
  })
  async createStores(@Body() body: CreateDebuggingStoreDto): Promise<Store[]> {
    return this.appService.createStores(body.numberStore);
  }

  @ApiTags('User')
  @Post('create-user')
  @ApiBody({
    type: CreateDebuggingUserDto,
  })
  @ApiOkResponse({
    description: 'The Users has been successfully created.',
    isArray: true,
    type: User,
  })
  async createUsers(@Body() body: CreateDebuggingUserDto): Promise<User[]> {
    return this.appService.createUser(body.numberUser);
  }
}
