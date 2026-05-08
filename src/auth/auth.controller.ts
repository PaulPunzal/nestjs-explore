import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleGuard } from './guards/google.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {
    // Guard redirects to Google automatically
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req: any) {
    // req.user comes from GoogleStrategy.validate()
    const user = await this.authService.validateGoogleUser(req.user);
    return this.authService.generateToken(user);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  getProfile(@Req() req: any) {
    // req.user comes from JwtStrategy.validate()
    return req.user;
  }
}