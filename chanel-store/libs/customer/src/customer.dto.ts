// External module
import { filterMetadata } from '@chanel-store/core';

// Internal module
import { Profile } from './customer.entity';

export class CreateProfileDTO extends filterMetadata(
  Profile,
  'swagger/apiModelPropertiesArray',
  [':id', ':created_at', ':updated_at', ':deleted_at'],
  'CreateProfileDTO'
) {}
