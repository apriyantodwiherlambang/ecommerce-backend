// src/common/interfaces/request.interface.ts

import { Request as ExpressRequest } from 'express';

export interface CustomRequest extends ExpressRequest {
  user: {
    id: number;
    role: string;
  };
}
