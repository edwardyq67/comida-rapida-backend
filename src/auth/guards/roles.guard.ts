// src/auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Rol } from '@prisma/client';

// Decorador para roles
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: Rol[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Rol[]>('roles', context.getHandler());
    if (!roles) return true; // Si no se especifican roles, se permite acceso

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['jwt'];
    if (!token) throw new ForbiddenException('No autorizado');

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!roles.includes(payload.rol)) {
        throw new ForbiddenException('No tienes permisos suficientes');
      }
      request['user'] = payload; // opcional, guardar info del usuario en request
      return true;
    } catch {
      throw new ForbiddenException('Token inválido o expirado');
    }
  }
}
