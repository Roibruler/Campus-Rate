import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const CHAMPS_DATE = ['createdAt', 'updatedAt'] as const;

export async function lireJSON<T>(chemin: string): Promise<T[]> {
    let contenu: string;

    try {
        contenu = await readFile(chemin, 'utf-8');
    } catch (err: any) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }

    let donnees: any[];
    try {
        donnees = JSON.parse(contenu);
    } catch {
        throw new Error(`Le fichier de données est corrompu (JSON invalide) : ${chemin}`);
    }

    return donnees.map((item) => {
        const copie = { ...item };
        for (const champ of CHAMPS_DATE) {
            if (champ in copie) {
                copie[champ] = new Date(copie[champ]);
            }
        }
        return copie as T;
    });
}

export async function ecrireJSON<T>(chemin: string, donnees: T[]): Promise<void> {
    await mkdir(dirname(chemin), { recursive: true });
    await writeFile(chemin, JSON.stringify(donnees, null, 2), 'utf-8');
}