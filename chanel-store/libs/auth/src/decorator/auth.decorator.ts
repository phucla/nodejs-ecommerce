// Standard library
import { SetMetadata } from '@nestjs/common';

// External module
import { Role } from '@chanel-store/shared';

// Internal module
import { IS_PUBLIC_KEY, ROLES_METADATA } from '../constants/auth.const';

/**
 * Define Public decorator
 */
export const Pubic = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Define Roles decorator
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_METADATA, roles);
