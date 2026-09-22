import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppreciationService } from './appreciation.service';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';
import { Appreciation } from './entities/appreciation.entity';
import { ProblemDetailsDto } from '../common/dto/problem-details.dto';

@ApiTags('appreciations')
@Controller('appreciations')
export class AppreciationController {
  constructor(private readonly appreciationService: AppreciationService) {}

  @Post()
  @ApiOperation({ summary: 'Publier une nouvelle appréciation pour un endroit existant' })
  @ApiResponse({ status: 201, description: 'Appréciation créée avec succès', type: Appreciation })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide', type: ProblemDetailsDto })
  @ApiResponse({ status: 404, description: "L'endroit référencé (placeId) n'existe pas", type: ProblemDetailsDto })
  async create(
    @Body() createAppreciationDto: CreateAppreciationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const appreciation = await this.appreciationService.create(createAppreciationDto);
    res.location(`/v1/appreciations/${appreciation.id}`);
    return appreciation;
  }

  @Get()
  @ApiOperation({ summary: "Lister les appréciations, avec filtre optionnel par endroit" })
  @ApiQuery({ name: 'placeId', required: false, description: "Filtrer les appréciations d'un endroit précis" })
  @ApiResponse({ status: 200, description: 'Liste des appréciations', type: [Appreciation] })
  findAll(@Query('placeId') placeId?: string) {
    return this.appreciationService.findAll(placeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulter une appréciation par son id' })
  @ApiParam({ name: 'id', example: 'apr_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Appréciation trouvée', type: Appreciation })
  @ApiResponse({ status: 404, description: 'Appréciation introuvable', type: ProblemDetailsDto })
  findOne(@Param('id') id: string) {
    return this.appreciationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier partiellement une appréciation' })
  @ApiParam({ name: 'id', example: 'apr_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 200, description: 'Appréciation mise à jour', type: Appreciation })
  @ApiResponse({ status: 400, description: 'Corps de requête invalide', type: ProblemDetailsDto })
  @ApiResponse({ status: 404, description: 'Appréciation introuvable', type: ProblemDetailsDto })
  update(@Param('id') id: string, @Body() updateAppreciationDto: UpdateAppreciationDto) {
    return this.appreciationService.update(id, updateAppreciationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une appréciation' })
  @ApiParam({ name: 'id', example: 'apr_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ApiResponse({ status: 204, description: 'Appréciation supprimée, aucun contenu retourné' })
  @ApiResponse({ status: 404, description: 'Appréciation introuvable', type: ProblemDetailsDto })
  remove(@Param('id') id: string) {
    return this.appreciationService.remove(id);
  }
}