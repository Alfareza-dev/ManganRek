import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['auth_token'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mangan_rek_secret_key_2026_secure',
    });
  }

  async validate(payload: any) {
    if (payload.role === 'KASIR') {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          managedResto: {
            include: { owner: true },
          },
        },
      });
      
      if (!user || user.status === 'REJECTED') {
         throw new ForbiddenException('Akun kasir ditolak');
      }

      if (user.managedResto && user.managedResto.owner.status === 'REJECTED') {
        throw new ForbiddenException('Akses ditolak: Restoran induk telah diblokir');
      }
    }

    return { userId: payload.sub, email: payload.email, role: payload.role, status: payload.status };
  }
}
