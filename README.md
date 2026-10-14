# CampusRate

API REST pour consulter et noter des endroits/services du campus. Fait pour le TP2 du cours 420-514 (évolution du TP1 : persistance MongoDB, validation systématique, sécurité HTTP de base, et plusieurs fonctionnalités optionnelles).

## C'est quoi

On peut créer des endroits (locations) et laisser des appréciations (avec une note) sur ces endroits. La note moyenne et le nombre d'appréciations se recalculent automatiquement (via une agrégation MongoDB) à chaque appréciation ajoutée, modifiée ou supprimée.

Un endroit qui a encore des appréciations ne peut pas être supprimé (erreur 409). Une même personne (nom d'auteur) ne peut laisser qu'une seule appréciation par endroit (index unique, erreur 409 en cas de doublon).

## Technologies

- NestJS (TypeScript)
- MongoDB + Mongoose pour la persistance
- class-validator pour la validation
- Swagger pour la doc
- Helmet pour la sécurité HTTP
- @nestjs/throttler pour le rate limiting

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

Les variables `HTTPS_ENABLED`, `SSL_KEY_PATH`, `SSL_CERT_PATH`, `HTTP_REDIRECT_PORT` et `JWT_SECRET`/`JWT_EXPIRES_IN` sont optionnelles (voir sections HTTPS et Authentification plus bas) ; l'API fonctionne normalement sans elles.

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

Tous les champs obligatoires sont validés (texte non vide, enum, note entre 1 et 5, commentaire entre 5 et 500 caractères). Le `ValidationPipe` global (`whitelist` + `forbidNonWhitelisted`) refuse toute propriété non déclarée dans le DTO.

Les champs gérés par le serveur (`id`, `createdAt`, `updatedAt`, `averageRating`, `reviewCount`) ne sont jamais acceptés en entrée : ils n'existent tout simplement pas dans les DTO de création/modification, donc le `ValidationPipe` les rejette automatiquement (400) s'ils sont envoyés.

Les DTO de modification (`UpdateLocationDto`, `UpdateAppreciationDto`) listent explicitement les propriétés réellement modifiables plutôt que de réutiliser tel quel le DTO de création — `placeId` d'une appréciation, par exemple, ne peut jamais être changé après coup.

## Sécurité

- **CORS** : origines explicitement configurées via `CORS_ORIGINS`, méthodes HTTP restreintes à `GET, POST, PATCH, DELETE`. En production, `CORS_ORIGINS` doit être défini (pas de repli silencieux) ; en développement/test, un repli vers `http://localhost:3000` est accepté. CORS limite certaines requêtes faites depuis un navigateur, mais ne constitue pas une authentification de l'API.
- **Helmet** : ajoute des en-têtes HTTP de sécurité standards (ex. `X-Content-Type-Options`, `X-Frame-Options`) pour réduire les risques côté client (sniffing de type MIME, clickjacking, etc.).
- **Rate limiting** : 60 requêtes/minute par IP (voir options bonus H1).

## Référence vs imbrication (MongoDB)

`Appreciation` référence `Location` par `placeId` (une chaîne), plutôt que d'imbriquer les appréciations directement dans le document `Location`. Ce choix a été gardé du TP1 pour plusieurs raisons : les appréciations sont créées, modifiées et supprimées indépendamment de l'endroit (opérations CRUD propres) ; un endroit populaire pourrait accumuler un grand nombre d'appréciations, ce qui grossirait indéfiniment le document `Location` si elles étaient imbriquées (MongoDB limite un document à 16 Mo) ; et le recalcul de `averageRating`/`reviewCount` se fait par agrégation sur la collection `appreciations` filtrée par `placeId`, sans avoir à charger/réécrire tout le document `Location` à chaque appréciation.

## Fonctionnalités optionnelles réellement implantées

| Code | Fonctionnalité | Où |
|------|-----------------|-----|
| M1 | Index unique composé (`placeId` + `authorName`) + gestion de la duplication (409) | `appreciation.entity.ts`, `appreciation.repository.ts` |
| M2 | Agrégation MongoDB (`$match` + `$group`) pour `averageRating`/`reviewCount` | `appreciation.repository.ts` (`aggregerStatistiques`) |
| M3 | Justification référence vs imbrication | section ci-dessus |
| H1 | Rate limiting (60 req/min/IP) | `app.module.ts` (`ThrottlerModule`) |
| H2 | Limite de taille du corps HTTP (10 Ko) + 413 | `main.ts` |
| H3 | Vérification du `Content-Type` + 415 | `common/middleware/content-type.middleware.ts` |
| H4 | CORS différencié par environnement (dev/test vs production stricte) | `main.ts` |
| H5 | Méthodes HTTP explicitement restreintes (`GET, POST, PATCH, DELETE`) | `main.ts` |
| P1 | Allowlist explicite de filtres (`category` typé en enum) | `location/dto/find-all-locations.dto.ts` |
| P2 | Sélection explicite des propriétés modifiables (DTO de PATCH dédiés) | `location/dto/update-location.dto.ts`, `appreciation/dto/update-appreciation.dto.ts` |
| P3 | Protection contre l'injection NoSQL via la query string (parseur `simple`, DTO validé pour `placeId`) | `main.ts`, `appreciation/dto/find-all-appreciations.dto.ts` |
| L1 | Logs INFO des opérations (méthode, chemin, code, durée, requestId) | `common/interceptors/logging.interceptor.ts` |
| L2 | Logs ERROR distincts, sans secrets ni stack trace exposée au client | `common/filters/problem-details.filter.ts` |
| T1 | Explication du rôle de HTTPS | section HTTPS ci-dessous |
| T2 | HTTPS fonctionnel en local | `main.ts` (désactivé par défaut, `HTTPS_ENABLED=true`) |
| T3 | Certificat local autosigné | dossier `certs/` (généré, jamais versionné) |
| T4 | Redirection HTTP → HTTPS | `main.ts` (serveur de redirection séparé) |

### HTTPS (T1)

HTTPS chiffre le trafic entre le client et le serveur (confidentialité), garantit que les données ne sont pas altérées en transit (intégrité), et permet au client de vérifier l'identité du serveur via son certificat (authenticité). Sans HTTPS, un identifiant, un jeton ou le contenu d'une requête pourrait être lu ou modifié par un intermédiaire sur le réseau. Un certificat autosigné (comme celui utilisé ici en local) chiffre bien le trafic, mais ne prouve pas l'identité du serveur à un tiers — c'est pourquoi le navigateur affiche un avertissement ; en production, un certificat signé par une autorité reconnue est nécessaire.

### Activer HTTPS en local (T2/T3/T4)

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:2048 -keyout certs/localhost-key.pem -out certs/localhost-cert.pem -days 365 -nodes -subj "/CN=localhost"
```

Puis dans `.env` :
```
HTTPS_ENABLED=true
SSL_KEY_PATH=./certs/localhost-key.pem
SSL_CERT_PATH=./certs/localhost-cert.pem
HTTP_REDIRECT_PORT=3001
```

L'API tourne alors sur `https://localhost:3000/v1` (certificat autosigné, le navigateur avertit que ce n'est pas vérifié — normal en local), et toute requête sur `http://localhost:3001` est redirigée en HTTPS (301).

## Limites connues

- Filtre seulement par `category` pour les locations, pas de recherche texte.
- Le rate limiting (60 req/min/IP) est une limite globale simple, pas différenciée par route.
- Le certificat HTTPS local est autosigné : à usage de démonstration seulement, pas valide pour un vrai déploiement.
