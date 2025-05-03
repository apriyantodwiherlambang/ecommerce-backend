import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { UsersModule } from '../users/users.module'; // Impor UsersModule
import { JwtModule } from '@nestjs/jwt'; // Impor JwtModule

@Module({
  imports: [
    UsersModule, // Pastikan UsersModule diimpor
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }), // Implikasi JwtModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
