import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProblemDetailsDto } from '../dto/problem-details.dto';


@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, title, detail } = this.analyserException(exception);

        const problemDetails: ProblemDetailsDto  = {
            type: 'about:blank',
            title,
            status,
            detail,
            instance: request.url,
        };

        response
            .status(status)
            .contentType('application/problem+json') // Comme demandé mais pas sûr que ça soit nécessaire
            .send(JSON.stringify(problemDetails));
    }

    private analyserException(exception: unknown): {
        status: number;
        title: string;
        detail: string;
    } {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const reponse = exception.getResponse();

            const detail =
                typeof reponse === 'string' ? reponse : this.extraireMessage(reponse);

            return {
                status,
                title: this.titrePourStatut(status),
                detail,
            };
        }

        // Erreur qu'on garde pour nous.
        console.error(exception);

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            title: 'Internal Server Error',
            detail: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
        };
    }

    private extraireMessage(reponse: object): string {
        const message = (reponse as { message?: string | string[] }).message;
        return Array.isArray(message)
            ? message.join(' ; ')
            : (message ?? 'Une erreur est survenue.');
    }

    private titrePourStatut(status: number): string {
        switch (status) {
            case HttpStatus.BAD_REQUEST:
                return 'Bad Request';
            case HttpStatus.NOT_FOUND:
                return 'Not Found';
            case HttpStatus.CONFLICT:
                return 'Conflict';
            case HttpStatus.UNPROCESSABLE_ENTITY:
                return 'Unprocessable Entity';
            default:
                return 'Error';
        }
    }
}