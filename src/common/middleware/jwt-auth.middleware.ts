// src/common/middleware/jwt-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { CustomRequest } from '../interfaces/request.interface';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1]; // Ambil token setelah 'Bearer'

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('Decoded JWT:', decoded); // Log untuk memastikan apa yang ada di dalam decoded JWT
      req.user = { id: decoded.id, role: decoded.role }; // Menambahkan data user ke dalam request
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
