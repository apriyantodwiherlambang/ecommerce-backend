import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly configService: ConfigService,
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

    const updatedData: Partial<Product> = {
      name: updateProductDto.name,
      description: updateProductDto.description,
      price: updateProductDto.price,
      stock: updateProductDto.stock,
      category,
    };

    if (updateProductDto.image) {
      updatedData.image = updateProductDto.image;
    }

    await this.productRepository.update(id, updatedData);

    const updatedProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'createdBy'],
    });

    return this.addBaseUrlToImage(updatedProduct);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category', 'createdBy'],
    });

    return products.map((product) => this.addBaseUrlToImage(product));
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'createdBy'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.addBaseUrlToImage(product);
  }

  async findByCategory(categoryName: string): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      throw new NotFoundException(`Category '${categoryName}' not found`);
    }

    const products = await this.productRepository.find({
      where: { category: { id: category.id } },
      relations: ['category'],
    });

    return products.map((product) => this.addBaseUrlToImage(product));
  }

  async remove(id: string): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      return false;
    }

    await this.productRepository.delete(id);
    return true;
  }

  // ✅ Tambahkan Base URL ke image
  private addBaseUrlToImage(product: Product): Product {
    if (!product.image) return product;

    const baseUrl = this.configService.get<string>('BASE_URL');
    if (!product.image.startsWith('http')) {
      product.image = `${baseUrl}/uploads/${product.image}`;
    }

    return product;
  }
}
