// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Rol } from '@prisma/client'; // 👈 usar el enum de Prisma

export class RegisterDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto válido' })
  nombre?: string;

  @IsEnum(Rol, { message: 'El rol no es válido' })
  rol?: Rol; // 👈 opcional si quieres default USER
}
