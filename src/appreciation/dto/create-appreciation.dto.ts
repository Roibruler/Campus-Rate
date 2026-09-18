import { IsString, IsNotEmpty, IsInt, Min, Max } from "class-validator";

export class CreateAppreciationDto {
    @IsString()
    @IsNotEmpty()
    placeId: string;

    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsNotEmpty()
    comment: string;
}