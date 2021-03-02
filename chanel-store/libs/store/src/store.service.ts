// Standard libs
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';

// Internal module
import { Store, BusinessHour } from './store.entity';

@Injectable()
export class StoreService extends CsCrudEntityService<Store> {
  constructor(
    @InjectRepository(Store) private csRepository: Repository<Store>
  ) {
    super(csRepository);
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
