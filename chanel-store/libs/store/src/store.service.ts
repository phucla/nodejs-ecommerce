// Standard libs
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';

// Internal module
import { Store, BusinessHour } from './store.entity';
import { IStore } from './interface';

@Injectable()
export class StoreService extends CsCrudEntityService<Store> {
  constructor(
    @InjectRepository(Store) private csRepository: Repository<Store>
  ) {
    super(csRepository);
  }

  /**
   *
   * @param payload
   */
  async createStore(payload: IStore): Promise<Store> {
    // Check duplicate store email
    const store: Store = await this.findOne({
      email: payload.email,
    });

    if (store) {
      throw new HttpException(
        "Duplicate Store's email",
        HttpStatus.BAD_REQUEST
      );
    }

    const storeData: IStore = {
      name: payload.name,
      lat: payload.lat,
      lng: payload.lng,
      phone_number: payload.phone_number,
      email: payload.email,
      description: payload.description,
      store_address: payload.store_address,
    };

    const storeEntity: Store = await this.create(storeData);
    return storeEntity;
  }
}

@Injectable()
export class BusinessHourService extends CsCrudEntityService<BusinessHour> {
  constructor(
    @InjectRepository(BusinessHour)
    private csRepository: Repository<BusinessHour>
  ) {
    super(csRepository);
  }
}
