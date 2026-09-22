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
import { FindAllLocationsDto } from './dto/find-all-locations.dto';
import { PaginatedResult } from '../common/pagination.interface';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  async create(createLocationDto: CreateLocationDto) {
    return ajouterLocation({
      ...createLocationDto,
      services: createLocationDto.services ?? [],
      status: createLocationDto.status ?? LocationStatus.ACTIVE,
    });
  }

  async findAll(query: FindAllLocationsDto): Promise<PaginatedResult<Location>> {
    const toutes = await lireLocations();

    const filtrees = query.category
      ? toutes.filter((l) => l.category === query.category)
      : toutes;

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const totalItems = filtrees.length;
    const totalPages = Math.ceil(totalItems / limit);

    const debut = (page - 1) * limit;
    const data = filtrees.slice(debut, debut + limit);

    return {
      data,
      pagination: { page, limit, totalItems, totalPages },
    };
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