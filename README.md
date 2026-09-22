# CampusRate

API REST pour consulter et noter des endroits/services du campus. Fait pour le TP1 du cours 420-514.

## C'est quoi

On peut créer des endroits (locations) et laisser des appréciations (avec une note) sur ces endroits. La note moyenne et le nombre d'appréciations sont recalculés automatiquement à chaque fois qu'une appréciation est ajoutée, modifiée ou supprimée.

Un endroit qui a encore des appréciations ne peut pas être supprimé (erreur 409).

## Installation

```bash
npm ci
```

Copier `.env.example` en `.env` :
PORT=3000
DATA_FILE_PATH=./data

Le serveur refuse de démarrer si le `.env` est manquant ou invalide.

## Lancer le projet

```bash
npm run start:dev
```

L'API tourne sur `http://localhost:3000/v1`.

La doc Swagger est sur `http://localhost:3000/api` — c'est là qu'on peut tester chaque route directement dans le navigateur.

## Routes

**Locations**
- `POST /v1/locations` — créer un endroit
- `GET /v1/locations` — lister les endroits (avec filtre `category` et pagination `page`/`limit`)
- `GET /v1/locations/:id` — voir un endroit
- `PATCH /v1/locations/:id` — modifier un endroit
- `DELETE /v1/locations/:id` — supprimer un endroit

**Appreciations**
- `POST /v1/appreciations` — ajouter une appréciation
- `GET /v1/appreciations` — lister les appréciations (avec filtre optionnel `placeId`)
- `GET /v1/appreciations/:id` — voir une appréciation
- `PATCH /v1/appreciations/:id` — modifier une appréciation
- `DELETE /v1/appreciations/:id` — supprimer une appréciation

Les erreurs reviennent au format `application/problem+json` (type, title, status, detail).

## Mes choix

- Les id sont générés par le serveur avec `crypto.randomUUID()`, préfixés selon le type (`loc_...`, `apr_...`) pour les reconnaître facilement.
- Les routes sont versionnées avec `/v1` (via le système de versionnement de NestJS) au cas où on ajouterait une v2 plus tard.
- On n'a pas imbriqué les routes (`/locations/:id/appreciations`) — une appréciation garde son propre id et peut être consultée/modifiée directement. Le lien avec l'endroit se fait via `placeId`, autant dans le corps de la ressource que comme filtre optionnel sur `GET /v1/appreciations`.
- Validation stricte : les champs non prévus dans le DTO sont rejetés (400) plutôt qu'ignorés.
- Toutes les exceptions passent par un filtre global qui reformate en Problem Details, pour ne jamais renvoyer un message d'erreur brut au client.

## Limites connues

- La persistance se fait dans des fichiers JSON, donc pas fait pour des écritures concurrentes à haute fréquence.
- Pas d'authentification — n'importe qui peut créer/modifier/supprimer.
- Le filtre sur les locations ne supporte que `category`, pas de recherche texte.