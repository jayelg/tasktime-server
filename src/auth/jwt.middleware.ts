import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface CustomRequest extends Request {
  user?: Express.User & { _id: string; email: string };
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
        req.user = {
          _id: _id,
          email: email,
        };
      } catch (err) {
        // Handle JWT verification error
      }
    }

    next();
  }
}
