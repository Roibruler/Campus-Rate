import { ApiProperty } from '@nestjs/swagger';
import { LocationCategory } from '../enum/location.enum';
import { LocationStatus } from '../enum/status.enum';

export class Location {
    @ApiProperty({ example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    id: string;

    @ApiProperty({ example: 'Bibliothèque principale' })
    name: string;

    @ApiProperty({ example: 'Espace calme avec prises.' })
    description: string;

    @ApiProperty({ enum: LocationCategory, example: LocationCategory.STUDY_SPACE })
    category: LocationCategory;

    @ApiProperty({ example: 'Pavillon A, local A-210' })
    address: string;

    @ApiProperty({ type: [String], example: ['WIFI', 'POWER_OUTLETS'] })
    services: string[];

    @ApiProperty({ enum: LocationStatus, example: LocationStatus.ACTIVE })
    status: LocationStatus;

    @ApiProperty({ example: 4.25, nullable: true })
    averageRating: number | null;

    @ApiProperty({ example: 12 })
    reviewCount: number;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    updatedAt: Date;
}