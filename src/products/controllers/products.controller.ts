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
        fileSize: 5 * 1024 * 1024, // max 5MB
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ): Promise<{ message: string; data: Product }> {
    console.log('User:', req.user);
    console.log('Received DTO:', createProductDto);
    console.log('Received File:', file);

    if (!file) {
      console.warn('Warning: No file uploaded');
    } else {
      createProductDto.image = `${BASE_URL}/uploads/products/${file.filename}`;
      console.log('Set image URL:', createProductDto.image);
    }

    try {
      const product = await this.productsService.create(
        createProductDto,
        req.user,
      );
      console.log('Created product:', product);
      return {
        message: `Product successfully created by ${req.user.username}`,
        data: product,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
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
    console.log(`Updating product id: ${id}`);
    console.log('Received update DTO:', updateProductDto);
    console.log('Received File:', file);

    if (file) {
      updateProductDto.image = `${BASE_URL}/uploads/products/${file.filename}`;
      console.log('Set new image URL:', updateProductDto.image);
    }

    try {
      const product = await this.productsService.update(id, updateProductDto);
      console.log('Updated product:', product);
      return {
        message: `Product successfully updated by ${req.user.username}`,
        data: product,
      };
    } catch (error) {
      console.error(`Error updating product id ${id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete()
  async delete(
    @Query('id') id: string,
    @Req() req,
  ): Promise<{ message: string }> {
    console.log(`Deleting product id: ${id}`);
    try {
      await this.productsService.remove(id);
      console.log(`Product id ${id} deleted successfully`);
      return {
        message: `Product successfully deleted by ${req.user.username}`,
      };
    } catch (error) {
      console.error(`Error deleting product id ${id}:`, error);
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Product[]> {
    console.log('Fetching all products');
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    console.log(`Fetching product id: ${id}`);
    return this.productsService.findOne(id);
  }

  @Get('/category/:name')
  async findByCategory(@Param('name') name: string) {
    console.log(`Fetching products by category: ${name}`);
    return this.productsService.findByCategory(name);
  }
}
