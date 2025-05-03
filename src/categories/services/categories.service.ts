// src/categories/services/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // Create category with the admin who creates it
  async create(
    createCategoryDto: CreateCategoryDto,
    createdBy: string,
  ): Promise<Category> {
    // Create a new category and set createdBy as the admin's username
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      createdBy, // Set the username of the admin who created the category
    });
    return this.categoryRepository.save(category); // Save category to the database
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['products', 'products.createdBy'], // <-- join dengan tabel produk
    });
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'products.createdBy'], // <-- join juga saat ambil per id
    });
  }

  // Update category
  async update(id: string, updateCategoryDto: any): Promise<Category> {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  // Remove category by id
  async delete(id: string): Promise<void> {
    const category = await this.findOne(id); // Find category by ID
    if (!category) {
      throw new Error('Category not found'); // Throw error if category not found
    }
    await this.categoryRepository.delete(id); // Delete category from the database
  }
}
