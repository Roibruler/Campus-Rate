import { Injectable, NestMiddleware, UnsupportedMediaTypeException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
    private readonly methodesAvecCorps = new Set(['POST', 'PUT', 'PATCH']);

    use(req: Request, _res: Response, next: NextFunction): void {
        if (!this.methodesAvecCorps.has(req.method)) {
            next();
            return;
        }

        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            throw new UnsupportedMediaTypeException(
                'Le Content-Type doit être application/json.',
            );
        }

        next();
    }
}
