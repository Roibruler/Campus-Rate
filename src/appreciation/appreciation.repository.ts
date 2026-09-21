import { lireJSON, ecrireJSON } from '../utils/file.Json';
import { generateId } from '../utils/id.util';
import { Appreciation } from './entities/appreciation.entity';
import { obtenirCheminDonnees } from '../location/../config/data-path.util';

const PREFIXE_ID = 'apr';

export async function lireAppreciations(): Promise<Appreciation[]> {
    return lireJSON<Appreciation>(obtenirCheminDonnees('appreciation.json'));
}

export async function ecrireAppreciations(appreciations: Appreciation[]): Promise<void> {
    return ecrireJSON<Appreciation>(obtenirCheminDonnees('appreciation.json'), appreciations);
}

export async function ajouterAppreciation(
    donnees: Omit<Appreciation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appreciation> {
    const appreciations = await lireAppreciations();
    const maintenant = new Date();

    const nouvelleAppreciation: Appreciation = {
        ...donnees,
        id: generateId(PREFIXE_ID),
        createdAt: maintenant,
        updatedAt: maintenant,
    };

    appreciations.push(nouvelleAppreciation);
    await ecrireAppreciations(appreciations);

    return nouvelleAppreciation;
}


export async function lireAppreciationsParLieu(placeId: string): Promise<Appreciation[]> {
    const toutes = await lireAppreciations();
    return toutes.filter((a) => a.placeId === placeId);
}

export async function trouverAppreciationParId(id: string): Promise<Appreciation | undefined> {
    const appreciations = await lireAppreciations();
    return appreciations.find((a) => a.id === id);
}

export async function mettreAJourAppreciation(
    id: string,
    donnees: Partial<Omit<Appreciation, 'id' | 'createdAt' | 'placeId'>>
): Promise<Appreciation | undefined> {
    const appreciations = await lireAppreciations();
    const index = appreciations.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    const appreciationMiseAJour: Appreciation = {
        ...appreciations[index],
        ...donnees,
        updatedAt: new Date(),
    };

    appreciations[index] = appreciationMiseAJour;
    await ecrireAppreciations(appreciations);

    return appreciationMiseAJour;
}

export async function supprimerAppreciation(id: string): Promise<boolean> {
    const appreciations = await lireAppreciations();
    const index = appreciations.findIndex((a) => a.id === id);
    if (index === -1) return false;

    appreciations.splice(index, 1);
    await ecrireAppreciations(appreciations);

    return true;
}