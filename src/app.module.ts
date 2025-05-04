// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config'; // pastikan path sesuai
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart_items/cart-items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // ✅ Gunakan ini, jangan hardcode lagi
    UsersModule,
    AdminModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
  ],
})
export class AppModule {}
