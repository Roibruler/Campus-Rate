# CampusRate

API REST pour consulter et noter des endroits/services du campus. Fait pour le TP1 du cours 420-514.

## C'est quoi

On peut créer des endroits (locations) et laisser des appréciations (avec une note) sur ces endroits. La note moyenne et le nombre d'appréciations sont recalculés automatiquement à chaque fois qu'une appréciation est ajoutée, modifiée ou supprimée.

Un endroit qui a encore des appréciations ne peut pas être supprimé (erreur 409).

## Technologies

- NestJS (TypeScript)
- class-validator / class-transformer pour la validation
- @nestjs/swagger pour la doc OpenAPI
- @nestjs/config pour la configuration par variables d'environnement
- node:fs/promises pour la persistance JSON
- Postman pour les tests manuels

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

## Qualité du code

```bash
npm run lint
npm run build
```

## Routes

**Locations**
- `POST /v1/locations` — créer un endroit
- `GET /v1/locations` — lister les endroits (filtre `category`, pagination `page`/`limit`, max 50 par page)
- `GET /v1/locations/:id` — voir un endroit
- `PATCH /v1/locations/:id` — modifier un endroit
- `DELETE /v1/locations/:id` — supprimer un endroit (refusé si des appréciations y sont encore rattachées)

**Appreciations**
- `POST /v1/appreciations` — ajouter une appréciation (commentaire entre 5 et 500 caractères)
- `GET /v1/appreciations` — lister les appréciations (filtre optionnel `placeId`)
- `GET /v1/appreciations/:id` — voir une appréciation
- `PATCH /v1/appreciations/:id` — modifier une appréciation
- `DELETE /v1/appreciations/:id` — supprimer une appréciation

Un endroit sans appréciation a `averageRating: null` et `reviewCount: 0`. Une location sans `status` précisé prend `ACTIVE` par défaut, et `services` prend `[]` par défaut (pas de doublons acceptés).

Les erreurs reviennent au format `application/problem+json` (type, title, status, detail).

## Mes choix de design

| Décision | Choix | Pourquoi |
|---|---|---|
| Noms de ressources | `locations`, `appreciations` (anglais, pluriel, sans verbe) | Cohérent avec les modules NestJS, pas de renommage inutile en `places`/`reviews` |
| Id | `loc_<uuid>` / `apr_<uuid>`, générés par `crypto.randomUUID()` côté serveur | Le préfixe identifie tout de suite le type de ressource; pas d'id séquentiel pour éviter les collisions |
| Versionnement | `/v1` via le système de versionnement de NestJS (`VersioningType.URI`) | Convention uniforme, extensible si une v2 arrive un jour |
| Imbrication | Pas d'URI imbriquée (`/locations/:id/appreciations`) | Une appréciation a son propre cycle de vie (consultable/modifiable seule); le lien se fait par `placeId` dans le corps et comme filtre optionnel sur `GET /appreciations` |
| Codes de succès | `201` + en-tête `Location`, `200`, `204` sans corps | Sémantique HTTP standard selon l'opération |
| Codes d'erreur | `400`/`404`/`409`/`500` en Problem Details | Un filtre global reformate toutes les exceptions, sans jamais exposer de détail technique brut |

## Limites connues

- La persistance se fait dans des fichiers JSON, donc pas fait pour des écritures concurrentes à haute fréquence.
- Pas d'authentification — n'importe qui peut créer/modifier/supprimer.
- Le filtre sur les locations ne supporte que `category`, pas de recherche texte.