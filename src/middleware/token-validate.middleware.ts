import { NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { env } from 'process';
import { NextFunction, Request, Response } from 'express';

export class TokenValidateMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.accesstoken as string;
    verify(token, env.SECRET_KEY, (error, decoded: { id: number }) => {
      if (error) {
        res.status(401).json({
          message: 'Invalid token',
        });
      } else {
        req.body.user_id = decoded.id;
        next();
      }
    });
  }
}
