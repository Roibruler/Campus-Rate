import { lireJSON, ecrireJSON } from '../utils/file.Json';
import { generateId } from '../utils/id.util';
import { Location } from './entities/location.entity';

const CHEMIN_LOCATIONS = 'location.json';
const PREFIXE_ID = 'loc';

export async function lireLocations(): Promise<Location[]> {
    return lireJSON<Location>(CHEMIN_LOCATIONS);
}

export async function ecrireLocations(locations: Location[]): Promise<void> {
    return ecrireJSON<Location>(CHEMIN_LOCATIONS, locations);
}

export async function ajouterLocation(
    donnees: Omit<Location, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'reviewCount'>
): Promise<Location> {
    const locations = await lireLocations();
    const maintenant = new Date();

    const nouvelleLocation: Location = {
        ...donnees,
        id: generateId(PREFIXE_ID),
        averageRating: null,
        reviewCount: 0,
        createdAt: maintenant,
        updatedAt: maintenant,
    };

    locations.push(nouvelleLocation);
    await ecrireLocations(locations);

    return nouvelleLocation;
}
