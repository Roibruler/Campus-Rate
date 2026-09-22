import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiQuery } from '@nestjs/swagger';
import { LocationCategory } from './enum/location.enum';
import { FindAllLocationsDto } from './dto/find-all-locations.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async create(
    @Body() createLocationDto: CreateLocationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const location = await this.locationService.create(createLocationDto);
    res.location(`/v1/locations/${location.id}`);
    return location;
  }

  @Get()
  @ApiQuery({ name: 'category', enum: LocationCategory, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  findAll(@Query() query: FindAllLocationsDto) {
    return this.locationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}