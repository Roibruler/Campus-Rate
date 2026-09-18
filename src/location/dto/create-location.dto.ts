import { LocationCategory } from "../enum/location.enum";
import { LocationStatus } from "../enum/status.enum";
import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLocationDto {
    @ApiProperty({ example: "Bibliothèque principale" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: "Espace calme avec prises." })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ enum: LocationCategory, example: LocationCategory.STUDY_SPACE })
    @IsEnum(LocationCategory)
    @IsNotEmpty()
    category: LocationCategory;

    @ApiProperty({ example: "Pavillon A, local A-210" })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ type: [String], example: ["WIFI", "POWER_OUTLETS"], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    services?: string[];

    @ApiProperty({ enum: LocationStatus, example: LocationStatus.ACTIVE, required: false })
    @IsOptional()
    @IsEnum(LocationStatus)
    status?: LocationStatus;
}