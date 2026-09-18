import { IsString, IsNotEmpty, IsEnum, IsDate, IsNumber } from "class-validator";

export class CreateAppreciationDto {
    @IsString()
    @IsNotEmpty()
    placeId: string;

    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsNumber()
    @IsNotEmpty()
    rating: number;

    @IsString()
    @IsNotEmpty()
    comment: string;
    
    @IsDate()
    @IsNotEmpty()
    createdAt: Date; // toISOString() donne le format ISO 8601
    
    @IsDate()
    @IsNotEmpty()
    updatedAt: Date; // toISOString() donne le format ISO 8601
}
