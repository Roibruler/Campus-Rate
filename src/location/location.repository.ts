import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './entities/location.entity';
import { generateId } from '../utils/id.util';

const PREFIXE_ID = 'loc';

@Injectable()
export class LocationRepository {
    constructor(@InjectModel(Location.name) private readonly locationModel: Model<Location>) {}

    async findAll(): Promise<Location[]> {
        return this.locationModel.find().exec();
    }

    async findById(id: string): Promise<Location | null> {
        return this.locationModel.findOne({ id }).exec();
    }

    async create(
        donnees: Pick<Location, 'name' | 'description' | 'category' | 'address' | 'services' | 'status'>,
    ): Promise<Location> {
        const nouvelleLocation = new this.locationModel({
            ...donnees,
            id: generateId(PREFIXE_ID),
            averageRating: null,
            reviewCount: 0,
        });
        return nouvelleLocation.save();
    }

    async update(
        id: string,
        donnees: Partial<Omit<Location, 'id' | 'createdAt'>>,
    ): Promise<Location | null> {
        return this.locationModel.findOneAndUpdate({ id }, donnees, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const resultat = await this.locationModel.findOneAndDelete({ id }).exec();
        return resultat !== null;
    }
}