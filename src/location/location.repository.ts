// locationRepository.ts
import { lireJSON, ecrireJSON, prochainId } from '../utils/file.Json';
import { Location } from './entities/location.entity';

const CHEMIN_LOCATIONS = 'location.json';

export async function lireLocations(): Promise<Location[]> {
    return lireJSON<Location>(CHEMIN_LOCATIONS);
}

export async function ecrireLocations(locations: Location[]): Promise<void> {
    return ecrireJSON<Location>(CHEMIN_LOCATIONS, locations);
}

/**
 * Ajoute une nouvelle location. L'id, createdAt et updatedAt
 * sont assignés automatiquement.
 */
export async function ajouterLocation(
    donnees: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Location> {
    const locations = await lireLocations();
    const maintenant = new Date();

    const nouvelleLocation: Location = {
        ...donnees,
        id: prochainId(locations),
        createdAt: maintenant,
        updatedAt: maintenant,
    };

    locations.push(nouvelleLocation);
    await ecrireLocations(locations);

    return nouvelleLocation;
}