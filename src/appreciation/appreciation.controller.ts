import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppreciationService } from './appreciation.service';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';

@Controller('appreciation')
export class AppreciationController {
  constructor(private readonly appreciationService: AppreciationService) {}

  @Post()
  create(@Body() createAppreciationDto: CreateAppreciationDto) {
    return this.appreciationService.create(createAppreciationDto);
  }

  @Get()
  findAll() {
    return this.appreciationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appreciationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppreciationDto: UpdateAppreciationDto) {
    return this.appreciationService.update(+id, updateAppreciationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appreciationService.remove(+id);
  }
}
