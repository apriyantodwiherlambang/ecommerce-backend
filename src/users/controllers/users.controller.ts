import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  Res,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { imageUploadOptions } from '../../shared/utils/image-upload-options';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiResponse,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Express } from 'express';
import { Response } from 'express';
import { CustomRequest } from '../../common/interfaces/request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  @ApiBody({
    description: 'User registration details',
    type: CreateUserDto,
    examples: {
      'application/json': {
        value: {
          username: 'john_doe',
          email: 'john@example.com',
          password: 'Password123!',
        },
      },
    },
  })
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User successfully registered',
      data: await this.usersService.register(createUserDto),
    };
  }

  @Post('login')
  @Public()
  @ApiBody({
    description: 'User login credentials',
    type: LoginUserDto,
    examples: {
      example1: {
        summary: 'Sample login',
        value: {
          email: 'adminn@gmail.com',
          password: 'Adminn123!',
        },
      },
    },
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    const { accessToken, refreshToken, role, user } =
      await this.usersService.login(loginUserDto);

    const message =
      role === 'admin'
        ? 'Admin logged in successfully'
        : 'User logged in successfully';

    return {
      statusCode: HttpStatus.OK,
      message,
      accessToken,
      refreshToken,
      user, // Kirim user ke Flutter
    };
  }

  @Public()
  @Post('refresh-token')
  async refreshAccessToken(
    @Body() body: { userId: number; refreshToken: string },
  ) {
    const newAccessToken = await this.usersService.refreshToken(
      body.userId,
      body.refreshToken,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Access token refreshed successfully',
      accessToken: newAccessToken,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: User,
  })
  @ApiBody({
    description: 'User profile update details',
    type: UpdateUserDto,
    examples: {
      'application/json': {
        value: {
          phoneNumber: '081234567890',
          address: '123 Main St, Jakarta',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    return this.usersService.updateProfile(updateUserDto, undefined, userId);
  }

  @ApiResponse({
    status: 200,
    description: 'Profile image updated successfully',
    type: User,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile-image')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: CustomRequest,
  ) {
    const logger = new Logger('UsersController');
    try {
      if (!file) {
        logger.error('No file uploaded');
        throw new BadRequestException('No file uploaded');
      }

      if (!file.mimetype.startsWith('image/')) {
        logger.error(`Invalid file type: ${file.mimetype}`);
        throw new BadRequestException(
          'Invalid file type. Only image files are allowed.',
        );
      }

      const userId = request.user.id;
      logger.log(`User ID: ${userId}`);
      logger.log(`Uploaded file info: ${JSON.stringify(file)}`);

      return await this.usersService.updateProfileImage(userId, file.path);
    } catch (error) {
      logger.error('Error upload profile image', error.stack);
      throw error;
    }
  }
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    console.log('req.user:', req.user);
    return this.usersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    // Implementasi logout opsional
    return { message: 'User logged out successfully' };
  }
}
