import { SetMetadata } from '@nestjs/common';

// Decorator untuk menandai endpoint sebagai publik
export const Public = () => SetMetadata('isPublic', true);
