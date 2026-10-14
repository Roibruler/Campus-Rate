import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProblemDetailsDto } from '../dto/problem-details.dto';

interface ErreurBodyParser {
    status: number;
    type: string;
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
    private readonly logger = new Logger('Exceptions');

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { status, title, detail } = this.analyserException(exception);

        this.journaliser(exception, request, status);

        const problemDetails: ProblemDetailsDto  = {
            type: 'about:blank',
            title,
            status,
            detail,
            instance: request.url,
        };

        response
            .status(status)
            .contentType('application/problem+json')
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

        if (this.estErreurBodyParser(exception)) {
            return {
                status: exception.status,
                title: this.titrePourStatut(exception.status),
                detail:
                    exception.type === 'entity.too.large'
                        ? 'Le corps de la requête dépasse la taille maximale autorisée.'
                        : 'Le corps de la requête est invalide ou mal formé.',
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            title: 'Internal Server Error',
            detail: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
        };
    }

    private estErreurBodyParser(exception: unknown): exception is ErreurBodyParser {
        return (
            typeof exception === 'object' &&
            exception !== null &&
            'status' in exception &&
            'type' in exception &&
            typeof (exception as { status: unknown }).status === 'number'
        );
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
            case HttpStatus.PAYLOAD_TOO_LARGE:
                return 'Payload Too Large';
            case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
                return 'Unsupported Media Type';
            case HttpStatus.TOO_MANY_REQUESTS:
                return 'Too Many Requests';
            case HttpStatus.UNAUTHORIZED:
                return 'Unauthorized';
            case HttpStatus.FORBIDDEN:
                return 'Forbidden';
            default:
                return 'Error';
        }
    }

    private journaliser(exception: unknown, request: Request, status: number): void {
        const contexte = `${request.method} ${request.url} -> ${status}`;

        if (status >= 500) {
            this.logger.error(contexte, exception instanceof Error ? exception.stack : undefined);
            return;
        }

        if (status >= 400) {
            this.logger.warn(contexte);
        }
    }
}
