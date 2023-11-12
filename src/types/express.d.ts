// eslint-disable-next-line
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      email: string;
      id: number;
    };
  }
}
