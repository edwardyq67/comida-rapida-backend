// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 👈 opcional: lo hace disponible en toda la app sin importar cada vez
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
