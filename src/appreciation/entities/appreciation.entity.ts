import { ApiProperty } from '@nestjs/swagger';

export class Appreciation {
    @ApiProperty({ example: 'apr_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    id: string;

    @ApiProperty({ example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    placeId: string;

    @ApiProperty({ example: 'Samira' })
    authorName: string;

    @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
    rating: number;

    @ApiProperty({ example: 'Calme et Wi-Fi stable.' })
    comment: string;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    createdAt: Date; // toISOString() donne le format ISO 8601

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    updatedAt: Date; // toISOString() donne le format ISO 8601
}