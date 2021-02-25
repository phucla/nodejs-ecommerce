// Standard library
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

// Internal module
import { AuthService } from './auth.service';
import { JwtPayload } from './interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduRef: ModuleRef) {
    super({
      passReqToCallback: true,
    });
  }

  /**
   * Define helper validate user login
   * @param request
   * @param username
   * @param password
   */
  async validate(
    request: Request,
    username: string,
    password: string
  ): Promise<JwtPayload> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
