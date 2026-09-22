import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../entities/location.entity';
import { PaginationMetaDto } from '../../common/dto/pagination-meta.dto';

export class PaginatedLocationsDto {
    @ApiProperty({ type: [Location] })
    data: Location[];

    @ApiProperty({ type: PaginationMetaDto })
    pagination: PaginationMetaDto;
}