// src/products/services/products.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      createdBy: user,
      category,
    });

    return this.productRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const category = await this.categoryRepository.findOne({
      where: { id: updateProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.productRepository.update(id, {
      ...updateProductDto,
      category,
    });

    return this.productRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'createdBy'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'createdBy'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByCategory(categoryName: string): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      throw new NotFoundException(`Category '${categoryName}' not found`);
    }

    return this.productRepository.find({
      where: { category: { id: category.id } },
      relations: ['category'],
    });
  }

  async remove(id: string): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      return false; // biarkan controller yang lempar NotFoundException
    }

    await this.productRepository.delete(id);
    return true;
  }
}
