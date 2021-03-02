// External module
import { filterMetadata } from '@chanel-store/core';

// Internal module
import { Address, User } from './shared.entity';

export class CreateAddressDto extends filterMetadata(
  Address,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'CreateAddressDto'
) {}

export class CreateUserDto extends filterMetadata(
  User,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'CreateUserDto'
) {}

export class UpdateUserDto extends filterMetadata(
  User,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'UpdateUserDto'
) {}
