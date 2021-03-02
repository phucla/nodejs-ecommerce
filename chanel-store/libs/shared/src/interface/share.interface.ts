// Internal module
import { Role } from '../enums/role.enum';
import { User, Address } from '../shared.entity';

export interface IUser {
  email: string;
  user_name: string;
  password: string;
  role: Role;
}

export interface IAddress {
  address: string;
  city: string;
  zip_code: string;
  state: string;
}

export interface IShippingAddress {
  user: User;
  address: Address;
}
