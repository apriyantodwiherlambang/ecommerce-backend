import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Ambil token dari Authorization header
      secretOrKey: process.env.JWT_SECRET, // Ambil secret dari .env
    });
  }

  async validate(payload: {
    id: number; // ✅ Sesuaikan dengan struktur payload-mu
    role: string;
    username: string;
    name?: string;
  }) {
    console.log('JWT Payload:', payload);

    const user = await this.usersService.findOneById(payload.id); // ✅ Gunakan id, bukan sub
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Kembalikan info user untuk disimpan di req.user
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
  }
}
