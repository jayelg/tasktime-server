import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

interface CustomRequest extends Request {
  userId?: string;
  email?: string;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const { _id, email } = this.jwtService.decode(token) as {
          _id: string;
          email: string;
        };
        req.userId = _id;
        req.email = email;
      } catch (err) {
        // Handle JWT verification error
      }
    }

    next();
  }
}
