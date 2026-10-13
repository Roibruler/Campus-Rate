import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationStatus } from './enum/status.enum';
import { LocationRepository } from './location.repository';
import { Appreciation } from '../appreciation/entities/appreciation.entity';
import { FindAllLocationsDto } from './dto/find-all-locations.dto';
import { PaginatedResult } from '../common/pagination.interface';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository,
    @InjectModel(Appreciation.name) private readonly appreciationModel: Model<Appreciation>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    return this.locationRepository.create({
      name: createLocationDto.name,
      description: createLocationDto.description,
      category: createLocationDto.category,
      address: createLocationDto.address,
      services: createLocationDto.services ?? [],
      status: createLocationDto.status ?? LocationStatus.ACTIVE,
    });
  }

  async findAll(query: FindAllLocationsDto): Promise<PaginatedResult<Location>> {
    const toutes = await this.locationRepository.findAll();

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
    const location = await this.locationRepository.findById(id);
    if (!location) {
      throw new NotFoundException(`Aucune location trouvée avec l'id ${id}`);
    }
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const location = await this.locationRepository.update(id, updateLocationDto);
    if (!location) {
      throw new NotFoundException(`Aucune location trouvée avec l'id ${id}`);
    }
    return location;
  }

  async remove(id: string) {
    const appreciationsLiees = await this.appreciationModel.find({ placeId: id }).exec();
    if (appreciationsLiees.length > 0) {
      throw new ConflictException(
        `Impossible de supprimer la location ${id} : des appréciations y sont encore associées`,
      );
    }

    const supprimee = await this.locationRepository.delete(id);
    if (!supprimee) {
      throw new NotFoundException(`Aucune location trouvée avec l'id ${id}`);
    }
  }
}