import { Address } from '@chanel-store/shared';

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
