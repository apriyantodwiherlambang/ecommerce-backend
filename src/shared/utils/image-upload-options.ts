// src/users/utils/image-upload-options.ts

import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';

// Fungsi untuk memvalidasi tipe file
export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

// Konfigurasi Multer untuk upload file
export const imageUploadOptions = {
  storage: diskStorage({
    destination: './uploads/profile-images', // Folder penyimpanan gambar
    filename: (req, file, callback) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      callback(null, fileName); // Menyimpan dengan nama file unik
    },
  }),
  limits: { fileSize: 1_000_000 }, // Batas maksimal ukuran file 1MB
  fileFilter: imageFileFilter,
};
