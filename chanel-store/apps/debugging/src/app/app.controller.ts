// Standard library
import {
  Controller,
  Delete,
  Post,
  Body,
  UseInterceptors,
  Put,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';

// External module
import { Store } from '@chanel-store/store';
import { Role, User } from '@chanel-store/shared';
import { LoggingInterceptor, ValidatePipe } from '@chanel-store/core';

// Internal module
import { AppService } from './app.service';
import {
  CreateDebuggingStoreDto,
  CreateDebuggingUserDto,
  CreateDebuggingCategoryDto,
  CreateDebuggingStoreManagerDto,
  CreateDebuggingOrderDto,
  CreateDebuggingProductDto,
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
  @Post('store-manager')
  @ApiBody({
    type: CreateDebuggingStoreManagerDto,
  })
  @ApiOkResponse({
    description: 'The Store Manager has been successfully created.',
    isArray: true,
    type: User,
  })
  async createStoreManager(
    @Body(new ValidatePipe()) body: CreateDebuggingStoreManagerDto
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
    type: CreateDebuggingUserDto,
  })
  @ApiOkResponse({
    description: 'The Users has been successfully created.',
    isArray: true,
    type: User,
  })
  async createCustomers(
    @Body(new ValidatePipe()) body: CreateDebuggingUserDto
  ): Promise<User[]> {
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
    isArray: true,
  })
  async createProduct(
    @Body() body: CreateDebuggingProductDto
  ): Promise<Product[]> {
    return this.appService.createProducts(body.numberProduct, body.storeId);
  }

  /****************************/
  /** Debugging API of Order */
  /****************************/
  @ApiTags('Order')
  @Post('orders')
  @ApiBody({
    type: CreateDebuggingOrderDto,
  })
  @ApiOkResponse({
    description: 'The Orders has been successfully created.',
    type: Order,
    isArray: true,
  })
  async createOrders(@Body() body: CreateDebuggingOrderDto): Promise<Order[]> {
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

  /****************************/
  /** Debugging API of Admin account */
  /****************************/
  @ApiTags('Admin Account')
  @Post('admin')
  @ApiBody({
    type: CreateDebuggingStoreDto,
  })
  @ApiOkResponse({
    description: 'The root Admin has been successfully created.',
    type: User,
  })
  async createRootAdmin(): Promise<User> {
    return this.appService.createRootAdmin();
  }

  @ApiTags('Admin Account')
  @Put('admin/:id')
  @ApiOkResponse({
    description: 'The root Admin has been successfully updated.',
    type: User,
  })
  async updateRootAdmin(
    @Param('id') id: number,
    @Body() body: CreateDebuggingProductDto
  ): Promise<User> {
    return this.appService.updateRootAdmin(id, body);
  }
}
