// Standard library
import { filterMetadata } from '@chanel-store/core';

// Internal module
import { Store, BusinessHour } from './store.entity';

export class CreateStoreDTO extends filterMetadata(
  Store,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'CreateStoreDTO'
) {}

export class CreateBusinessHourDTO extends filterMetadata(
  BusinessHour,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'CreateBusinessHourDTO'
) {}
