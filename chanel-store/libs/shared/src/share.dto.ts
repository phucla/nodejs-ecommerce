// External module
import { filterMetadata } from '@chanel-store/core';

// Internal module
import { Address } from './shared.entity';

export class CreateAddressDTO extends filterMetadata(
  Address,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'CreateAddressDTO'
) {}
