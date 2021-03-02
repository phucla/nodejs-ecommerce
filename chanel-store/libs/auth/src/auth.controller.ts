// Standard library
import { Controller, UseGuards, Post, Request, Get } from '@nestjs/common';

// Internal module
import { AuthService } from './auth.service';
import { Roles, Pubic } from './decorator/auth.decorator';
import { Role } from './enums/role.enum';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginStatus } from './interface';

@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Pubic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginStatus> {
    return this.appService.login(req.user);
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Get('login')
  async getlogin(@Request() req): Promise<LoginStatus> {
    return req.user;
  }
}
