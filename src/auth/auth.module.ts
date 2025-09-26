import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 importa PrismaModule

@Module({
  imports: [
    PrismaModule, // 👈 para poder inyectar PrismaService en AuthService
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], // 👈 exporta JwtModule para usar JwtService en otros módulos
})
export class AuthModule {}
