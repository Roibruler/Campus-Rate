import { lireJSON, ecrireJSON } from '../utils/file.Json';
import { generateId } from '../utils/id.util';
import { Location } from './entities/location.entity';
import { obtenirCheminDonnees } from '../config/data-path.util';

const PREFIXE_ID = 'loc';

export async function lireLocations(): Promise<Location[]> {
    return lireJSON<Location>(obtenirCheminDonnees('location.json'));
}

export async function ecrireLocations(locations: Location[]): Promise<void> {
    return ecrireJSON<Location>(obtenirCheminDonnees('location.json'), locations);
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
export async function trouverLocationParId(id: string): Promise<Location | undefined> {
    const locations = await lireLocations();
    return locations.find((l) => l.id === id);
}

export async function mettreAJourLocation(
    id: string,
    donnees: Partial<Omit<Location, 'id' | 'createdAt'>>
): Promise<Location | undefined> {
    const locations = await lireLocations();
    const index = locations.findIndex((l) => l.id === id);
    if (index === -1) return undefined;

    const locationMiseAJour: Location = {
        ...locations[index],
        ...donnees,
        updatedAt: new Date(),
    };

    locations[index] = locationMiseAJour;
    await ecrireLocations(locations);

    return locationMiseAJour;
}

export async function supprimerLocation(id: string): Promise<boolean> {
    const locations = await lireLocations();
    const index = locations.findIndex((l) => l.id === id);
    if (index === -1) return false;

    locations.splice(index, 1);
    await ecrireLocations(locations);

    return true;
}