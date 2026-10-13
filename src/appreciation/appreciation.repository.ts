import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appreciation } from './entities/appreciation.entity';
import { generateId } from '../utils/id.util';

const PREFIXE_ID = 'apr';

@Injectable()
export class AppreciationRepository {
    constructor(
        @InjectModel(Appreciation.name) private readonly appreciationModel: Model<Appreciation>,
    ) {}

    async findAll(): Promise<Appreciation[]> {
        return this.appreciationModel.find().exec();
    }

    async findByPlaceId(placeId: string): Promise<Appreciation[]> {
        return this.appreciationModel.find({ placeId }).exec();
    }

    async findById(id: string): Promise<Appreciation | null> {
        return this.appreciationModel.findOne({ id }).exec();
    }

    async create(
        donnees: Pick<Appreciation, 'placeId' | 'authorName' | 'rating' | 'comment'>,
    ): Promise<Appreciation> {
        const nouvelleAppreciation = new this.appreciationModel({
            ...donnees,
            id: generateId(PREFIXE_ID),
        });
        return nouvelleAppreciation.save();
    }

    async update(
        id: string,
        donnees: Partial<Omit<Appreciation, 'id' | 'createdAt' | 'placeId'>>,
    ): Promise<Appreciation | null> {
        return this.appreciationModel.findOneAndUpdate({ id }, donnees, { new: true }).exec();
    }

    async delete(id: string): Promise<boolean> {
        const resultat = await this.appreciationModel.findOneAndDelete({ id }).exec();
        return resultat !== null;
    }
}