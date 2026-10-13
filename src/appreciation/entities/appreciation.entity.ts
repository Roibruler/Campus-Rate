import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

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
export class Appreciation extends Document {
    @ApiProperty({ example: 'apr_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @Prop({ type: String, required: true, unique: true })
    id: string;

    @ApiProperty({ example: 'loc_3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @Prop({ type: String, required: true })
    placeId: string;

    @ApiProperty({ example: 'Samira' })
    @Prop({ type: String, required: true })
    authorName: string;

    @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
    @Prop({ type: Number, required: true })
    rating: number;

    @ApiProperty({ example: 'Calme et Wi-Fi stable.' })
    @Prop({ type: String, required: true })
    comment: string;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-09-17T14:30:00.000Z' })
    updatedAt: Date;
}

export const AppreciationSchema = SchemaFactory.createForClass(Appreciation);