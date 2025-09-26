// src/auth/entities/auth.entity.ts
import { Rol } from '@prisma/client';

export class Usuario {
  id: number;
  email: string;
  password: string;
  nombre?: string | null;
  rol: Rol;
  creadoEn: Date;
  actualizadoEn: Date;
}
