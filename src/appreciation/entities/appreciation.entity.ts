export class Appreciation {
    id: number;
    placeId: string;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: Date; // toISOString() donne le format ISO 8601
    updatedAt: Date; // toISOString() donne le format ISO 8601
}
