import { Injectable } from '@nestjs/common';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';

@Injectable()
export class AppreciationService {
  create(createAppreciationDto: CreateAppreciationDto) {
    return 'This action adds a new appreciation';
  }

  findAll() {
    return `This action returns all appreciations`;
  }

  findOne(id: string) {
    return `This action returns a #${id} appreciation`;
  }

  update(id: string, updateAppreciationDto: UpdateAppreciationDto) {
    return `This action updates a #${id} appreciation`;
  }

  remove(id: string) {
    return `This action removes a #${id} appreciation`;
  }
}