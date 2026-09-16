import { Injectable } from '@nestjs/common';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';

@Injectable()
export class AppreciationService {
  create(createAppreciationDto: CreateAppreciationDto) {
    return 'This action adds a new appreciation';
  }

  findAll() {
    return `This action returns all appreciation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appreciation`;
  }

  update(id: number, updateAppreciationDto: UpdateAppreciationDto) {
    return `This action updates a #${id} appreciation`;
  }

  remove(id: number) {
    return `This action removes a #${id} appreciation`;
  }
}
