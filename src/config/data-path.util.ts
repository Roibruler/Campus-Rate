export function obtenirCheminDonnees(nomFichier: string): string {
    const dossier = process.env.DATA_FILE_PATH;
    if (!dossier) {
        throw new Error("La variable d'environnement DATA_FILE_PATH n'est pas définie");
    }
    return `${dossier}/${nomFichier}`;
}