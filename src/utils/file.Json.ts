import { readFile, writeFile } from 'node:fs/promises';

const CHAMPS_DATE = ['createdAt', 'updatedAt'] as const;

export async function lireJSON<T>(chemin: string): Promise<T[]> {
    try {
        const contenu = await readFile(chemin, 'utf-8');
        const donnees: any[] = JSON.parse(contenu);

        return donnees.map((item) => {
            const copie = { ...item };
            for (const champ of CHAMPS_DATE) {
                if (champ in copie) {
                    copie[champ] = new Date(copie[champ]);
                }
            }
            return copie as T;
        });
    } catch (err: any) {
        if (err.code === 'ENOENT') return [];
        throw err;
    }
}

export async function ecrireJSON<T>(chemin: string, donnees: T[]): Promise<void> {
    await writeFile(chemin, JSON.stringify(donnees, null, 2), 'utf-8');
}