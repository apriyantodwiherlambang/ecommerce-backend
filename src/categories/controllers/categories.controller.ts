import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Category } from '../entities/category.entity';
import { UserRole } from '../../users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Admin-only create category
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Body() createCategoryDto: any,
    @Req() req,
  ): Promise<{ message: string; data: Category }> {
    const adminUsername = req.user.username;
    const category = await this.categoriesService.create(
      createCategoryDto,
      adminUsername,
    );
    return {
      message: `Category successfully created by ${adminUsername}`,
      data: category,
    };
  }

  // Get all categories (public)
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  // Get category by id (public)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ category: Category; createdBy: string }> {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return {
      category,
      createdBy: category.createdBy,
    };
  }

  // Admin-only delete category
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req,
  ): Promise<{ message: string; deletedBy: string; categoryId: string }> {
    const adminUsername = req.user.username;
    const category = await this.categoriesService.findOne(id);

    if (!category) {
      throw new Error('Category not found');
    }

    await this.categoriesService.delete(id);

    return {
      message: 'Category successfully deleted',
      deletedBy: adminUsername,
      categoryId: id,
    };
  }
}
