import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { Express } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.usersRepository.findOne({ where: { email: createUserDto.email } }),
      this.usersRepository.findOne({
        where: { username: createUserDto.username },
      }),
    ]);

    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role || 'user',
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to register user', error.message);
    }
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string; role: string }> {
    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role, username: user.username };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = randomBytes(64).toString('hex');
    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);

    return { accessToken, refreshToken, role: user.role };
  }

  async refreshToken(userId: number, refreshToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { id: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    return accessToken;
  }

  async updateProfile(
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
    userId: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (file) {
      user.profileImage = file.path;
      user.profileImageMimeType = file.mimetype;
    }

    user.phoneNumber = updateUserDto.phoneNumber || user.phoneNumber;
    user.address = updateUserDto.address || user.address;

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Failed to update profile', error.message);
    }
  }

  async updateProfileImage(userId: number, imagePath: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.profileImage = imagePath;
    await this.usersRepository.save(user);

    return user;
  }

  async getProfileImage(
    userId: number,
  ): Promise<{ image: string; mimeType: string }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.profileImage) {
      throw new NotFoundException('Profile image not found');
    }

    return {
      image: user.profileImage,
      mimeType: user.profileImageMimeType,
    };
  }

  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
