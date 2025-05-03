import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { RolesGuard } from './common/guards/roles.guard';
dotenv.config();

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Menambahkan konfigurasi CORS
  app.enableCors({
    origin: '*', // Atau kamu bisa ganti dengan domain yang diizinkan, misalnya 'http://localhost:4200'
    allowedHeaders: 'Content-Type, Authorization', // Pastikan Authorization ada di sini
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  });

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for the E-Commerce project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // akses di http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();
