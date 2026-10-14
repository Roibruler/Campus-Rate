import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LocationCategory } from '../enum/location.enum';
import { LocationStatus } from '../enum/status.enum';

export class UpdateLocationDto {
    @ApiPropertyOptional({ example: 'Bibliothèque principale' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({ example: 'Espace calme avec prises.' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiPropertyOptional({ enum: LocationCategory, example: LocationCategory.STUDY_SPACE })
    @IsOptional()
    @IsEnum(LocationCategory)
    category?: LocationCategory;

    @ApiPropertyOptional({ example: 'Pavillon A, local A-210' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @ApiPropertyOptional({ type: [String], example: ['WIFI', 'POWER_OUTLETS'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayUnique()
    services?: string[];

    @ApiPropertyOptional({ enum: LocationStatus, example: LocationStatus.ACTIVE })
    @IsOptional()
    @IsEnum(LocationStatus)
    status?: LocationStatus;
}
