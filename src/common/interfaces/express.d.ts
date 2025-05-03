// src/common/interfaces/express.d.ts

declare namespace Express {
  export interface Request {
    user: Partial<User>; // Sesuaikan dengan struktur payload JWT yang kamu pakai
  }
}
