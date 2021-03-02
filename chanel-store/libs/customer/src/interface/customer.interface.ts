// Internal
import { Gender } from '../enums/gender.enum';
import { Store } from '@chanel-store/store';
import { Address, User } from '@chanel-store/shared';

export interface IProfile {
  first_name: string;
  last_name: string;
  gender: Gender;
  phone_number: string;
  address: Address;
  user: User;
  store?: Store;
}
