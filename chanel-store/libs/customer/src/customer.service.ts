// Standard libs
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// External libs
import { CsCrudEntityService } from '@chanel-store/core';

// Internal module
import { Profile } from './customer.entity';

@Injectable()
export class CustomerService {}

@Injectable()
export class ProfileService extends CsCrudEntityService<Profile> {
  constructor(
    @InjectRepository(Profile) private csRepository: Repository<Profile>
  ) {
    super(csRepository);
  }
}
