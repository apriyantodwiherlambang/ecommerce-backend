// src/products/controllers/products.controller.ts

import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Req,
  UseInterceptors,
  UploadedFile,
  Delete,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const PRODUCT_UPLOAD_PATH = './uploads/products';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: PRODUCT_UPLOAD_PATH,
        filename: (req, file, cb) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<{ message: string; data: Product }> {
    const user = req.user;

    if (file) {
      createProductDto.image = `${BASE_URL}/uploads/products/${file.filename}`;
    }

    const product = await this.productsService.create(createProductDto, user);

    return {
      message: `Product successfully created by ${user.username}`,
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: PRODUCT_UPLOAD_PATH,
        filename: (req, file, cb) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<{ message: string; data: Product }> {
    if (file) {
      updateProductDto.image = `${BASE_URL}/uploads/products/${file.filename}`;
    }

    const product = await this.productsService.update(id, updateProductDto);

    return {
      message: `Product successfully updated by ${req.user.username}`,
      data: product,
    };
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete()
  async delete(
    @Query('id') id: string,
    @Req() req,
  ): Promise<{ message: string }> {
    await this.productsService.remove(id);
    return {
      message: `Product successfully deleted by ${req.user.username}`,
    };
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }
}
