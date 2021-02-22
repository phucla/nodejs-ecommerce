// Standard library
import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common';

// External module
import { Store } from '@chanel-store/store';
import { Role, User } from '@chanel-store/shared';

// Internal module
import { AppService } from './app.service';
import {
  CreateDebuggingStoreDto,
  CreateDebuggingUserDto,
  CreateDebuggingCategoryDto,
  DebuggingStoreManagerDto,
  DebuggingOrderDto,
} from './app.dto';
import { Category, Order, Product } from '@chanel-store/product';

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

  @ApiTags('Store')
  @Post('create-store-manager')
  @ApiBody({
    type: DebuggingStoreManagerDto,
  })
  @ApiOkResponse({
    description: 'The Store Manager has been successfully created.',
    isArray: true,
    type: User,
  })
  async createStoreManager(
    @Body() body: DebuggingStoreManagerDto
  ): Promise<User[]> {
    return this.appService.createStoreManager(body.numberManager, body.storeId);
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

  @ApiTags('Product')
  @Post('create-category')
  @ApiBody({
    type: CreateDebuggingCategoryDto,
  })
  @ApiOkResponse({
    description: 'The Category has been successfully created.',
    isArray: true,
    type: Category,
  })
  async createCategory(
    @Body() body: CreateDebuggingCategoryDto
  ): Promise<Category[]> {
    return this.appService.createCategory(
      body.numberCategory,
      body.storeId,
      body.parentId
    );
  }

  @ApiTags('Product')
  @Post('create-product')
  @ApiOkResponse({
    description: 'The Product has been successfully created.',
    type: Product,
  })
  async createProduct(): Promise<Product> {
    return this.appService.createProductWitoutStore();
  }

  @ApiTags('Order')
  @Post('create-orders')
  @ApiBody({
    type: DebuggingOrderDto,
  })
  @ApiOkResponse({
    description: 'The Orders has been successfully created.',
    type: Order,
    isArray: true,
  })
  async createOrders(@Body() body: DebuggingOrderDto): Promise<Order[]> {
    return this.appService.createOrders(body.numberOrder, body.customerId);
  }

  @Post('init-data')
  async initData(): Promise<void> {
    this.appService.initData();
  }

  @Delete('remove-data')
  async removeAllData() {
    return this.appService.removeData();
  }

  @Delete('remove-customers')
  async removeCustomer() {
    return this.appService.removeUsers(Role.StoreManager);
  }
}
