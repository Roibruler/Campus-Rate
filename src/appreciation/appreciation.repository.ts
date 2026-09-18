// appreciationRepository.ts
import { lireJSON, ecrireJSON, prochainId } from '../utils/file.Json';
import { Appreciation } from './entities/appreciation.entity';

const CHEMIN_APPRECIATIONS = 'appreciation.json';

export async function lireAppreciations(): Promise<Appreciation[]> {
    return lireJSON<Appreciation>(CHEMIN_APPRECIATIONS);
}

export async function ecrireAppreciations(appreciations: Appreciation[]): Promise<void> {
    return ecrireJSON<Appreciation>(CHEMIN_APPRECIATIONS, appreciations);
}

export async function ajouterAppreciation(
    donnees: Omit<Appreciation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appreciation> {
    const appreciations = await lireAppreciations();
    const maintenant = new Date();

    const nouvelleAppreciation: Appreciation = {
        ...donnees,
        id: prochainId(appreciations),
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