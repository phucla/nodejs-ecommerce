// External libs
import { Address } from '@chanel-store/shared';

// Internal module
import { Store } from '../store.entity';
import { DayOfWeek } from '../enums/day-of-week.enum';
export interface IStore {
  name: string;
  lat: string;
  lng: string;
  phone_number: string;
  email: string;
  description: string;
  store_address: Address;
  is_published?: boolean;
}

export interface IBusinessHourDto {
  open_hour: string;
  close_hour: string;
  date_of_week: DayOfWeek;
}

export interface IBusinessHour extends IBusinessHourDto {
  store: Store;
}

export interface ICreateStore extends IStore {
  business_hours: IBusinessHourDto[];
}
