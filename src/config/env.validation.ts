import { plainToInstance } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from 'class-validator';

class EnvironmentVariables {
    @IsInt()
    @Min(1)
    @Max(65535)
    PORT: number;

    @IsString()
    @IsNotEmpty()
    DATA_FILE_PATH: string;
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