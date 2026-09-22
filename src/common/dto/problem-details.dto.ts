import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
    @ApiProperty({ example: 'about:blank' })
    type: string;

    @ApiProperty({ example: 'Not Found' })
    title: string;

    @ApiProperty({ example: 404 })
    status: number;

    @ApiProperty({ example: "Aucune location trouvée avec l'id loc_..." })
    detail: string;

    @ApiProperty({ example: '/v1/locations/loc_...' })
    instance: string;
}