import { createHmac } from 'crypto';
import { CREATE_HMAC_KEY, CREATE_HMAC_DIGEST } from '@chanel-store/shared';

export const comparePassword = (
  userPassword: string,
  currentPassword: string
) => {
  return (
    createHmac(CREATE_HMAC_KEY, currentPassword).digest(CREATE_HMAC_DIGEST) ===
    userPassword
  );
};
