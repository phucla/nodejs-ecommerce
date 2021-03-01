// Standard library
import { Injectable } from '@nestjs/common';

// External libs
import { AddressService, IAddress, Address } from '@chanel-store/shared';
import {
  StoreService,
  BusinessHourService,
  Store,
  IStore,
  IBusinessHour,
  IBusinessHourDto,
  BusinessHour,
} from '@chanel-store/store';

// Internal module
import { CreateStoreDto, UpdateStoreDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(
    private businessHourService: BusinessHourService,
    private storeService: StoreService,
    private addressService: AddressService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to admin-portal!' };
  }

  /**
   * Create store
   * @param storeDto
   */
  async createStore(storeDto: CreateStoreDto): Promise<Store> {
    const addressData: IAddress = {
      address: storeDto.store_address.address,
      city: storeDto.store_address.city,
      zip_code: storeDto.store_address.zip_code,
      state: storeDto.store_address.state,
    };
    const address: Address = await this.addressService.create(addressData);

    const storeData: IStore = {
      name: storeDto.name,
      lat: storeDto.lat,
      lng: storeDto.lng,
      phone_number: storeDto.phone_number,
      email: storeDto.email,
      description: storeDto.description,
      store_address: address,
    };
    const store: Store = await this.storeService.createStore(storeData);

    const businessHours: IBusinessHourDto[] = storeDto.businessHours;

    for (const day of Object.values(businessHours)) {
      const businessHour: IBusinessHour = {
        open_hour: day.open_hour,
        close_hour: day.close_hour,
        date_of_week: day.date_of_week,
        store: store,
      };
      await this.businessHourService.create(businessHour);
    }
    const storebusinessHours: BusinessHour[] = await this.businessHourService.getBusinessHoursByStore(
      store
    );
    return {
      ...store,
      business_hours: storebusinessHours,
    };
  }

  /**
   * Get Stores
   */
  async getStores(): Promise<Store[]> {
    const stores: Store[] = await this.storeService.find({
      loadRelationIds: true,
    });
    const result: Store[] = [];
    for (const store of stores) {
      const address = await this.addressService.findOne(store.store_address);
      const businessHours = await this.businessHourService.getBusinessHoursByStore(
        store
      );
      result.push({
        ...store,
        store_address: address,
        business_hours: businessHours,
      });
    }

    return result;
  }

  /**
   * Update store by store id
   * @param storeId
   * @param payload
   */
  async updateStore(storeId: number, payload: UpdateStoreDto): Promise<void> {
    await this.storeService.updateById(storeId, {
      is_published: payload.is_published,
    });
  }
}
