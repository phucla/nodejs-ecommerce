// Standard library
import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Body,
} from '@nestjs/common';

// External module
import { ValidatePipe } from '@chanel-store/core';

// Internal module
import { AuthService } from './auth.service';
import { Roles, Pubic } from './decorator/auth.decorator';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LoginStatus } from './interface';
import { LoginDto } from './auth.dto';
@Controller()
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Pubic()
  @Post('login')
  async login(@Body(new ValidatePipe()) body: LoginDto): Promise<LoginStatus> {
    console.log('bodu', body);
    return this.appService.signIn(body);
  }

  @Roles(Role.User)
  @UseGuards(JwtAuthGuard)
  @Get('login')
  async getlogin(@Request() req): Promise<LoginStatus> {
    return req.user;
  }
}
