import { plainToInstance } from 'class-transformer';
import { IsBooleanString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsInt()
    @Min(1)
    @Max(65535)
    PORT: number;

    @IsString()
    @IsNotEmpty()
    MONGO_URI: string;

    @IsOptional()
    @IsIn(['development', 'production', 'test'])
    NODE_ENV?: string;

    @IsOptional()
    @IsString()
    CORS_ORIGINS?: string;

    @IsOptional()
    @IsBooleanString()
    HTTPS_ENABLED?: string;

    @IsOptional()
    @IsString()
    SSL_KEY_PATH?: string;

    @IsOptional()
    @IsString()
    SSL_CERT_PATH?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(65535)
    HTTP_REDIRECT_PORT?: number;

    @IsOptional()
    @IsString()
    JWT_SECRET?: string;

    @IsOptional()
    @IsString()
    JWT_EXPIRES_IN?: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(`Configuration invalide ou incomplète:\n${errors.toString()}`);
    }

    return validatedConfig;
}
