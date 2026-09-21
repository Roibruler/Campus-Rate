import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AppreciationService } from './appreciation.service';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';

@Controller('appreciations')
export class AppreciationController {
  constructor(private readonly appreciationService: AppreciationService) {}

  @Post()
  async create(
    @Body() createAppreciationDto: CreateAppreciationDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const appreciation = await this.appreciationService.create(createAppreciationDto);
    res.location(`/v1/appreciations/${appreciation.id}`);
    return appreciation;
  }

  @Get()
  findAll() {
    return this.appreciationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appreciationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppreciationDto: UpdateAppreciationDto) {
    return this.appreciationService.update(id, updateAppreciationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.appreciationService.remove(id);
  }
}