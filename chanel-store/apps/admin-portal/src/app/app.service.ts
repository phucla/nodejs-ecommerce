// Standard library
import { Injectable } from '@nestjs/common';
import { DeepPartial, In, Raw } from 'typeorm';

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
import { CsPaginationResultDto } from '@chanel-store/core';

// Internal module
import { UpdateStoreDto, PublishStoreDto, CreateStoreDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(
    private businessHourService: BusinessHourService,
    private storeService: StoreService,
    private addressService: AddressService
  ) {}

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

    const businessHours: IBusinessHourDto[] = storeDto.business_hours;

    for (const day of businessHours) {
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
  async getStores(query): Promise<CsPaginationResultDto<Store>> {
    const skippedItems = (query.page - 1) * query.limit;
    const totalCount = await this.storeService.countRecords();
    let storeQuery = {};
    let address: Address[] = [];
    if (query.city) {
      address = await this.addressService.find({
        where: {
          city: Raw(
            (city) => `LOWER(${city}) Like '%${query.city.toLowerCase()}%'`
          ),
        },
      });
    }

    if (address.length) {
      storeQuery = Object.assign(storeQuery, {
        store_address: In(address.map((item) => item.id)),
      });
    }

    if (query.name) {
      const name: string = query.name;
      storeQuery = Object.assign(storeQuery, {
        name: Raw((alias) => `LOWER(${alias}) Like '%${name.toLowerCase()}%'`),
      });
    }
    const stores: Store[] = await this.storeService.find({
      skip: skippedItems,
      take: query.limit,
      loadRelationIds: true,
      where: storeQuery,
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
    return {
      data: result,
      totalCount,
      page: query.page,
      limit: query.limit,
      length: result.length,
    };
  }

  /**
   * Publish or Unpublish
   * @param storeId
   * @param payload
   */
  async publishStore(storeId: number, payload: PublishStoreDto): Promise<void> {
    await this.storeService.updateById(storeId, {
      is_published: payload.is_published,
    });
  }

  async getStoreById(storeId: number): Promise<DeepPartial<Store>> {
    const store: Store = await this.storeService.findOne(
      {
        id: storeId,
      },
      {
        loadRelationIds: true,
      }
    );

    const address: Address = await this.addressService.findOne(
      store.store_address
    );
    const businessHours = await this.businessHourService.getBusinessHoursByStore(
      store
    );

    return {
      id: store.id,
      name: store.name,
      lat: store.lat,
      lng: store.lng,
      phone_number: store.phone_number,
      email: store.email,
      description: store.description,
      store_address: address,
      business_hours: businessHours,
      categories: store.categories,
      is_published: store.is_published,
      created_at: store.created_at,
      updated_at: store.updated_at,
    };
  }

  /**
   * Update store
   * @param storeId
   * @param payload
   */
  async updateStore(storeId: number, payload: UpdateStoreDto): Promise<void> {
    const businessHours = payload.business_hours;

    //  Update business hours of store
    for (const day of businessHours) {
      const businessHour: IBusinessHourDto = {
        open_hour: day.open_hour,
        close_hour: day.close_hour,
        date_of_week: day.date_of_week,
      };
      await this.businessHourService.updateById(day.id, businessHour);
    }
    await this.storeService.updateById(storeId, {
      name: payload.name,
      lat: payload.lat,
      lng: payload.lng,
      phone_number: payload.phone_number,
      email: payload.email,
      description: payload.description,
      store_address: payload.store_address,
    });
  }
}
