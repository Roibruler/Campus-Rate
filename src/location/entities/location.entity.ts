import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { LocationCategory } from '../enum/location.enum';
import { LocationStatus } from '../enum/status.enum';

@Schema({
    timestamps: true,
    toJSON: {
        transform: (_doc, ret: any) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
})
export class Location extends Document {
    @ApiProperty({ example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @Prop({ type: String, required: true, unique: true })
    id: string;

    @ApiProperty({ example: 'Bibliothèque principale' })
    @Prop({ type: String, required: true })
    name: string;

    @ApiProperty({ example: 'Espace calme avec prises.' })
    @Prop({ type: String, required: true })
    description: string;

    @ApiProperty({ enum: LocationCategory, example: LocationCategory.STUDY_SPACE })
    @Prop({ type: String, enum: LocationCategory, required: true })
    category: LocationCategory;

    @ApiProperty({ example: 'Pavillon A, local A-210' })
    @Prop({ type: String, required: true })
    address: string;

    @ApiProperty({ type: [String], example: ['WIFI', 'POWER_OUTLETS'] })
    @Prop({ type: [String], default: [] })
    services: string[];

    @ApiProperty({ enum: LocationStatus, example: LocationStatus.ACTIVE })
    @Prop({ type: String, enum: LocationStatus, default: LocationStatus.ACTIVE })
    status: LocationStatus;

    @ApiProperty({ example: 4.25, nullable: true })
    @Prop({ type: Number, default: null })
    averageRating: number | null;

    @ApiProperty({ example: 12 })
    @Prop({ type: Number, default: 0 })
    reviewCount: number;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    updatedAt: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);