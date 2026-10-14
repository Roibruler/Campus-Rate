import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appreciation } from './entities/appreciation.entity';
import { generateId } from '../utils/id.util';

const PREFIXE_ID = 'apr';
const CODE_ERREUR_DUPLICATION_MONGO = 11000;

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

        try {
            return await nouvelleAppreciation.save();
        } catch (error) {
            if (this.estErreurDuplicationMongo(error)) {
                throw new ConflictException(
                    `${donnees.authorName} a déjà publié une appréciation pour cet endroit (placeId: ${donnees.placeId}).`,
                );
            }
            throw error;
        }
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

    async aggregerStatistiques(
        placeId: string,
    ): Promise<Array<{ reviewCount: number; averageRating: number }>> {
        return this.appreciationModel
            .aggregate<{ reviewCount: number; averageRating: number }>([
                { $match: { placeId } },
                {
                    $group: {
                        _id: '$placeId',
                        reviewCount: { $sum: 1 },
                        averageRating: { $avg: '$rating' },
                    },
                },
            ])
            .exec();
    }

    private estErreurDuplicationMongo(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            (error as { code: unknown }).code === CODE_ERREUR_DUPLICATION_MONGO
        );
    }
}
