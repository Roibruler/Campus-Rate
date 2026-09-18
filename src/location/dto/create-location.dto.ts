import { LocationCategory } from "../enum/location.enum";
import { LocationStatus } from "../enum/status.enum";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";

export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(LocationCategory) // corrected to use @IsEnum(LocationCategory) for proper validation
    @IsNotEmpty()
    category: LocationCategory;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    services: string[];

    @IsEnum(LocationStatus) // corrected to use @IsEnum(LocationStatus) for proper validation
    @IsNotEmpty()
    status: LocationStatus;
}
