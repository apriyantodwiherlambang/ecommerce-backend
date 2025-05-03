import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/repositories/users.repository';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
