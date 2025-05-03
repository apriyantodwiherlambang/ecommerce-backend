import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity'; // ✅ pastikan path sesuai
import { Req } from '@nestjs/common';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Req() req) {
    console.log('AdminController - req.user:', req.user);
    return this.usersService.findAll();
  }
}
