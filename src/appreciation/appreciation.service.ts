import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';
import { AppreciationRepository } from './appreciation.repository';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class AppreciationService {
  constructor(
    private readonly appreciationRepository: AppreciationRepository,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
  ) { }

  async create(createAppreciationDto: CreateAppreciationDto) {
    const location = await this.locationModel.findOne({ id: createAppreciationDto.placeId }).exec();
    if (!location) {
      throw new NotFoundException(
        `Aucune location trouvée avec l'id ${createAppreciationDto.placeId}`,
      );
    }

    const appreciation = await this.appreciationRepository.create(createAppreciationDto);
    await this.recalculerStatistiques(createAppreciationDto.placeId);

    return appreciation;
  }

  async findAll(placeId?: string) {
    return placeId
      ? this.appreciationRepository.findByPlaceId(placeId)
      : this.appreciationRepository.findAll();
  }

  async findOne(id: string) {
    const appreciation = await this.appreciationRepository.findById(id);
    if (!appreciation) {
      throw new NotFoundException(`Aucune appréciation trouvée avec l'id ${id}`);
    }
    return appreciation;
  }

  async update(id: string, updateAppreciationDto: UpdateAppreciationDto) {
    const appreciation = await this.appreciationRepository.update(id, updateAppreciationDto);
    if (!appreciation) {
      throw new NotFoundException(`Aucune appréciation trouvée avec l'id ${id}`);
    }

    await this.recalculerStatistiques(appreciation.placeId);

    return appreciation;
  }

  async remove(id: string) {
    const appreciation = await this.appreciationRepository.findById(id);
    if (!appreciation) {
      throw new NotFoundException(`Aucune appréciation trouvée avec l'id ${id}`);
    }

    await this.appreciationRepository.delete(id);
    await this.recalculerStatistiques(appreciation.placeId);
  }

  private async recalculerStatistiques(placeId: string): Promise<void> {
    const [resultat] = await this.appreciationRepository.aggregerStatistiques(placeId);

    const reviewCount = resultat?.reviewCount ?? 0;
    const averageRating = reviewCount === 0 ? null : Math.round(resultat.averageRating * 100) / 100;

    await this.locationModel.findOneAndUpdate({ id: placeId }, { averageRating, reviewCount }).exec();
  }
}
