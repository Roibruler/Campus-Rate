import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LocationCategory } from '../enum/location.enum';

export class FindAllLocationsDto {
    @ApiPropertyOptional({ enum: LocationCategory })
    @IsOptional()
    @IsEnum(LocationCategory)
    category?: LocationCategory;

    @ApiPropertyOptional({ default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 50 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 10;
}