# CampusRate

API REST pour consulter et noter des endroits/services du campus. Fait pour le TP2 du cours 420-514.

## C'est quoi

On peut créer des endroits (locations) et laisser des appréciations (avec une note) sur ces endroits. La note moyenne et le nombre d'appréciations se recalculent automatiquement à chaque appréciation ajoutée, modifiée ou supprimée.

Un endroit qui a encore des appréciations ne peut pas être supprimé (erreur 409).

## Technologies

- NestJS (TypeScript)
- MongoDB + Mongoose pour la persistance
- class-validator pour la validation
- Swagger pour la doc
- Helmet pour la sécurité HTTP

## Installation

```bash
npm ci
```

Copier `.env.example` en `.env` et remplir :

```
PORT=3000
MONGO_URI=<la chaîne de connexion MongoDB>
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
```

`MONGO_URI` peut venir d'un cluster MongoDB Atlas ou d'un MongoDB local.

## Lancer le projet

```bash
npm run start:dev
```

API sur `http://localhost:3000/v1`, doc Swagger sur `http://localhost:3000/api`.

## Routes

**Locations**
- `POST /v1/locations`
- `GET /v1/locations` (filtre `category`, pagination `page`/`limit`)
- `GET /v1/locations/:id`
- `PATCH /v1/locations/:id`
- `DELETE /v1/locations/:id` (refusé si des appréciations existent encore)

**Appreciations**
- `POST /v1/appreciations`
- `GET /v1/appreciations` (filtre optionnel `placeId`)
- `GET /v1/appreciations/:id`
- `PATCH /v1/appreciations/:id`
- `DELETE /v1/appreciations/:id`

Les erreurs reviennent en `application/problem+json`.

## Validations

Tous les champs obligatoires sont validés (texte non vide, enum, note entre 1 et 5, commentaire entre 5 et 500 caractères). Les champs gérés par le serveur (`id`, `createdAt`, `updatedAt`, `averageRating`, `reviewCount`) sont refusés s'ils viennent du client.

## Sécurité

CORS configuré avec origine, et Helmet pour les en-têtes de sécurité de base.

## Fonctionnalités optionnelles

Aucune

## Limites connues

- Pas d'authentification.
- Filtre seulement par `category`, pas de recherche texte.
- Pas de rate limiting.