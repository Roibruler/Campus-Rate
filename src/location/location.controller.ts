import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FindAllLocationsDto } from './dto/find-all-locations.dto';
import { PaginatedLocationsDto } from './dto/paginated-locations.dto';
import { Location } from './entities/location.entity';
import { LocationCategory } from './enum/location.enum';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel endroit évalué' })
  @ApiResponse({ status: 201, description: 'Endroit créé avec succès', type: Location })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide', type: ProblemDetailsDto })
  async create(
    @Body() createLocationDto: CreateLocationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const location = await this.locationService.create(createLocationDto);
    res.location(`/v1/locations/${location.id}`);
    return location;
  }

  @Get()
  @ApiOperation({ summary: 'Lister les endroits, avec filtre et pagination' })
  @ApiQuery({ name: 'category', enum: LocationCategory, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Liste paginée des endroits', type: PaginatedLocationsDto })
  @ApiResponse({ status: 400, description: 'Paramètres de requête invalides', type: ProblemDetailsDto })
  findAll(@Query() query: FindAllLocationsDto) {
    return this.locationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter un endroit par son id' })
  @ApiParam({ name: 'id', example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Endroit trouvé', type: Location })
  @ApiResponse({ status: 404, description: 'Endroit introuvable', type: ProblemDetailsDto })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier partiellement un endroit' })
  @ApiParam({ name: 'id', example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Endroit mis à jour', type: Location })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide', type: ProblemDetailsDto })
  @ApiResponse({ status: 404, description: 'Endroit introuvable', type: ProblemDetailsDto })
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Supprimer un endroit (refusé s'il a des appréciations)" })
  @ApiParam({ name: 'id', example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 204, description: 'Endroit supprimé, aucun contenu retourné' })
  @ApiResponse({ status: 404, description: 'Endroit introuvable', type: ProblemDetailsDto })
  @ApiResponse({ status: 409, description: 'Conflit : des appréciations existent encore pour cet endroit', type: ProblemDetailsDto })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}