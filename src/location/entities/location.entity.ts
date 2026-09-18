import { LocationCategory } from '../enum/location.enum';
import { LocationStatus } from '../enum/status.enum';

export class Location {
    id: number;
    name: string;
    description: string;
    category: LocationCategory;
    address: string;
    services: string[];
    status: LocationStatus;
    averageRating: number | null;
    reviewCount : number;
    createdAt: Date; // toISOString() donne le format ISO 8601
    updatedAt: Date; // toISOString() donne le format ISO 8601
}
