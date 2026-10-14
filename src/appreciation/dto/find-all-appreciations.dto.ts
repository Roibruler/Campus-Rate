import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindAllAppreciationsDto {
    @ApiPropertyOptional({ description: "Filtrer les appréciations d'un endroit précis" })
    @IsOptional()
    @IsString()
    placeId?: string;
}
