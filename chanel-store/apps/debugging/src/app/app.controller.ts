// Standard library
import {
  Controller,
  Delete,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';

// External module
import { Store } from '@chanel-store/store';
import { Role, User } from '@chanel-store/shared';
import { LoggingInterceptor } from '@chanel-store/core';

// Internal module
import { AppService } from './app.service';
import {
  DebuggingStoreDto,
  DebuggingUserDto,
  DebuggingCategoryDto,
  DebuggingStoreManagerDto,
  DebuggingOrderDto,
  DebuggingProductDto,
} from './app.dto';
import { Category, Order, Product } from '@chanel-store/product';

@Controller('debugging')
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  /****************************/
  /** Debugging API of Store */
  /****************************/
  @ApiTags('Store')
  @Post('store')
  @ApiBody({
    type: DebuggingStoreDto,
  })
  @ApiOkResponse({
    description: 'The Store has been successfully created.',
    isArray: true,
    type: Store,
  })
  async createStores(@Body() body: DebuggingStoreDto): Promise<Store[]> {
    return this.appService.createStores(body.numberStore);
  }

  @ApiTags('Store')
  @Post('store-manager')
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

  @ApiTags('Store')
  @Delete('store-manager')
  async removeStoreManager(): Promise<void> {
    return this.appService.removeUsers(Role.StoreManager);
  }

  /******************************/
  /** Debugging API of Customer */
  /******************************/
  @ApiTags('Customer')
  @Post('customers')
  @ApiBody({
    type: DebuggingUserDto,
  })
  @ApiOkResponse({
    description: 'The Users has been successfully created.',
    isArray: true,
    type: User,
  })
  async createCustomers(@Body() body: DebuggingUserDto): Promise<User[]> {
    return this.appService.createUser(body.numberUser);
  }

  @ApiTags('Customer')
  @Delete('customers')
  async removeCustomer(): Promise<void> {
    return this.appService.removeUsers(Role.User);
  }

  @ApiTags('Product')
  @Post('create-category')
  @ApiBody({
    type: DebuggingCategoryDto,
  })
  @ApiOkResponse({
    description: 'The Category has been successfully created.',
    isArray: true,
    type: Category,
  })
  async createCategory(
    @Body() body: DebuggingCategoryDto
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
    isArray: true,
  })
  async createProduct(@Body() body: DebuggingProductDto): Promise<Product[]> {
    return this.appService.createProducts(body.numberProduct, body.storeId);
  }

  /****************************/
  /** Debugging API of Order */
  /****************************/
  @ApiTags('Order')
  @Post('orders')
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

  @ApiTags('Order')
  @Delete('orders')
  async removeOrders(): Promise<void> {
    return this.appService.removeOrders();
  }

  @Post('init-data')
  async initData(): Promise<void> {
    this.appService.initData();
  }

  @Delete('remove-data')
  async removeAllData() {
    return this.appService.removeData();
  }
}
