import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const requestId = randomUUID();
        const debut = Date.now();
        const { method, originalUrl } = request;

        return next.handle().pipe(
            tap({
                next: () => this.journaliser(requestId, method, originalUrl, response.statusCode, debut),
                error: () => this.journaliser(requestId, method, originalUrl, response.statusCode || 500, debut),
            }),
        );
    }

    private journaliser(
        requestId: string,
        method: string,
        path: string,
        statusCode: number,
        debut: number,
    ): void {
        const duration = Date.now() - debut;
        this.logger.log(
            `${method} ${path} ${statusCode} ${duration}ms requestId=${requestId}`,
        );
    }
}
