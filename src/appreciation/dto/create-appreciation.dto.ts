import { IsString, IsNotEmpty, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAppreciationDto {
    @ApiProperty({ example: "loc_3fa85f64-5717-4562-b3fc-2c963f66afa6" })
    @IsString()
    @IsNotEmpty()
    placeId: string;

    @ApiProperty({ example: "Samira" })
    @IsString()
    @IsNotEmpty()
    authorName: string;

    @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ example: "Calme et Wi-Fi stable." })
    @IsString()
    @IsNotEmpty()
    comment: string;
}