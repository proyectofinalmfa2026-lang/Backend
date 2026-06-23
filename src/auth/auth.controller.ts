import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Esta ruta redirige automáticamente a Google.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const user = req.user;

    const token = this.authService.generateJwt(user);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    return res.redirect(`${frontendUrl}/auth/success?token=${token}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Req() req: any) {
    const result = await this.authService.getProfileResponse(req.user.id);
    return result;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(
    @Req() req: any,
    @Body() data: { favoriteGenres?: string[]; badges?: { id: string; label: string; color: 'gold' | 'blue' | 'green' | 'purple' | 'rose' | 'cyan'; icon: string; requiredTier?: 'free' | 'premium' }[] },
  ) {
    return this.authService.updateProfile(req.user.id, data);
  }
}
