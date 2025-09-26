// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express'; // 👈 Importar Request
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // 👈 Importar el guard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return { message: 'Usuario registrado correctamente', user };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.login(dto);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    return { message: 'Login exitoso', user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logout exitoso' };
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  verifyAuth(@Req() req: Request) {
    return {
      authenticated: true,
      user: {
        id: req.user!['sub'],
        email: req.user!['email'],
        rol: req.user!['rol'],
      },
    };
  }
}
