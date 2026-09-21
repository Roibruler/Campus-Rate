import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationStatus } from './enum/status.enum';
import {
    ajouterLocation,
    lireLocations,
    trouverLocationParId,
    mettreAJourLocation,
    supprimerLocation,
} from './location.repository';
import { lireAppreciationsParLieu } from '../appreciation/appreciation.repository';

@Injectable()
export class LocationService {
  async create(createLocationDto: CreateLocationDto) {
    return ajouterLocation({
      ...createLocationDto,
      services: createLocationDto.services ?? [],
      status: createLocationDto.status ?? LocationStatus.ACTIVE,
    });
  }

  async findAll() {
    return lireLocations();
  }

  async findOne(id: string) {
    const location = await trouverLocationParId(id);
    if (!location) {
      throw new NotFoundException(`Aucune location trouvée avec l'id ${id}`);
    }
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = await mettreAJourLocation(id, updateLocationDto);
    if (!location) {
      throw new NotFoundException(`Aucune location trouvée avec l'id ${id}`);
    }
    return location;
  }

  async remove(id: string) {
    const appreciationsLiees = await lireAppreciationsParLieu(id);
    if (appreciationsLiees.length > 0) {
      throw new ConflictException(
        `Impossible de supprimer la location ${id} : des appréciations y sont encore associées`,
      );
    }

    const supprimee = await supprimerLocation(id);
    if (!supprimee) {
      throw new NotFoundException(`Aucune location trouvée avec l'id ${id}`);
    }
  }
}