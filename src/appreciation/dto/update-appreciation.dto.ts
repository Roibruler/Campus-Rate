import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateAppreciationDto {
    @ApiPropertyOptional({ example: 'Samira' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    authorName?: string;

    @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({ example: 'Calme et Wi-Fi stable.', minLength: 5, maxLength: 500 })
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(500)
    comment?: string;
}
