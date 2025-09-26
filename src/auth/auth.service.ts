// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '@prisma/client'; // 👈 usamos el Rol generado por Prisma

export interface UserResponse {
  id: number;
  email: string;
  nombre?: string | null;
  rol: Rol;
  creadoEn: Date;
  actualizadoEn: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<UserResponse> {
    const { email, password, nombre, rol } = dto;

    const existingUser = await this.prisma.usuario.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new BadRequestException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: UserResponse = await this.prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol: rol ?? Rol.USER, // 👈 default USER si no envían rol
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        creadoEn: true,
        actualizadoEn: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto): Promise<{ token: string; user: UserResponse }> {
    const { email, password } = dto;

    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email, rol: user.rol };
    const token = await this.jwtService.signAsync(payload);

    const safeUser: UserResponse = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      creadoEn: user.creadoEn,
      actualizadoEn: user.actualizadoEn,
    };

    return { token, user: safeUser };
  }
}
