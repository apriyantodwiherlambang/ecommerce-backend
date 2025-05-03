import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Menggunakan AuthGuard dari @nestjs/passport
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Menggunakan strategi 'jwt'
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true; // Jika endpoint menggunakan @Public(), bypass autentikasi
    }
    return super.canActivate(context); // Kalau tidak, jalankan AuthGuard normal
  }
}
