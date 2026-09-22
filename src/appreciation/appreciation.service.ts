import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppreciationDto } from './dto/create-appreciation.dto';
import { UpdateAppreciationDto } from './dto/update-appreciation.dto';
import {
    ajouterAppreciation,
    lireAppreciations,
    trouverAppreciationParId,
    mettreAJourAppreciation,
    supprimerAppreciation,
    lireAppreciationsParLieu,
} from './appreciation.repository';
import { trouverLocationParId, mettreAJourLocation } from '../location/location.repository';

@Injectable()
export class AppreciationService {
  async create(createAppreciationDto: CreateAppreciationDto) {
    const location = await trouverLocationParId(createAppreciationDto.placeId);
    if (!location) {
      throw new NotFoundException(
        `Aucune location trouvée avec l'id ${createAppreciationDto.placeId}`,
      );
    }

    const appreciation = await ajouterAppreciation(createAppreciationDto);
    await this.recalculerStatistiques(createAppreciationDto.placeId);

    return appreciation;
  }

  async findAll(placeId?: string) {
    return placeId ? lireAppreciationsParLieu(placeId) : lireAppreciations();
  }

  async findOne(id: string) {
    const appreciation = await trouverAppreciationParId(id);
    if (!appreciation) {
      throw new NotFoundException(`Aucune appréciation trouvée avec l'id ${id}`);
    }
    return appreciation;
  }

  async update(id: string, updateAppreciationDto: UpdateAppreciationDto) {
    // placeId n'est jamais modifiable, même si le client l'envoie dans le body
    const { placeId, ...donneesModifiables } = updateAppreciationDto;

    const appreciation = await mettreAJourAppreciation(id, donneesModifiables);
    if (!appreciation) {
      throw new NotFoundException(`Aucune appréciation trouvée avec l'id ${id}`);
    }

    await this.recalculerStatistiques(appreciation.placeId);

    return appreciation;
  }

  async remove(id: string) {
    const appreciation = await trouverAppreciationParId(id);
    if (!appreciation) {
      throw new NotFoundException(`Aucune appréciation trouvée avec l'id ${id}`);
    }

    await supprimerAppreciation(id);
    await this.recalculerStatistiques(appreciation.placeId);
  }

  private async recalculerStatistiques(placeId: string): Promise<void> {
    const appreciations = await lireAppreciationsParLieu(placeId);
    const reviewCount = appreciations.length;
    const averageRating =
      reviewCount === 0
        ? null
        : Math.round(
            (appreciations.reduce((somme, a) => somme + a.rating, 0) / reviewCount) * 100,
          ) / 100;

    await mettreAJourLocation(placeId, { averageRating, reviewCount });
  }
}