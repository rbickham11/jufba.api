# jufba.api

Tracking games and things

## Authentication

Each route in this API verifies an access token from Auth0. This access token should be sent as a Bearer token in the Authorization header.

`Authorization: Bearer {token}`

## Shared Types

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}
```

```typescript
interface Group {
  id: string;
  name: string | null;
  description: string | null;
}
```

```typescript
interface Game {
  id: string;
  date: string | null;
  name: string | null;
  structure: {
    bb?: number;
    sb?: number;
    maxBuyIn?: number;
    minBuyIn?: number;
  } | null;
  type: 'poker-cash' | 'poker-tournament';
  state: 100 | 200 | 300; // Not Started | Running | Complete
  groupId: string;
}
```

```typescript
interface Player {
  id: string;
  userId: string;
  gameId: string;
  buyIn: number | null;
  finalChipCount: number | null;
  maxChips: number | null;
  minChips: number | null;
}
```

## Endpoints

### user

#### GET /user

Retrieves information on the authenticated user. If called for the first time with a token retrieved by auth0, the user will also be provisioned to the database. Note: In a later version, this provisioing could be updated to happen on any API call.

Types: 

```typescript
interface GroupWithAdminStatus extends Group {
  isAdmin: boolean;
}

interface PlayerWithGame extends Player {
  game: Game;
}
```

Response Body:

```typescript
interface UserResponse extends User {
  groups: GroupWithAdminStatus[];
  players: PlayerWithGame[];
}
```

### groups

#### GET /groups

Retrieves a list of all groups

Response Body: `Group[]`

#### GET /groups/:id

Gets a group with expanded members

Response Body:
```typescript
interface GroupResponse extends Group {
  members: Array<{
    isAdmin: boolean;
    user: User;
  }>;
}
```

#### POST /groups

Creates a group

Request Body:
```typescript
interface GroupCreateRequest {
  name: string;
  description: string;
}
```

Response Body: `GroupResponse`

#### PUT /groups/:id

Updates a group

```typescript
interface GroupUpdateRequest {
  name: string;
  description: string;
}
```

Response Body: `GroupResponse`

#### DELETE /groups/:id

Deletes a group

#### POST /groups/:id/users

Adds a user to a group or updates their admin status in that group

```typescript
interface GroupUserRequest {
  userId: string;
  isAdmin: boolean;
}
```

#### DELETE /groups/:id/users

Removes a user from a group

Query Parameters
```typescript
interface GroupUserDeleteQuery {
  userId: string;
}
```

### games

#### GET /games

Lists games, optionally filtering by group

Query Parameters:

```typescript
interface GameListQuery {
  groupId?: string;
}
```

Response Body: `Game[]`

#### GET /games/:id

Gets a game

Response Body: `Game`


#### POST /games

Creates a game

Request Body

```typescript
interface GameCreateRequest {
  date: string | null;
  name: string | null;
  structure?: {
    bb?: number;
    sb?: number;
    maxBuyIn?: number;
    minBuyIn?: number;
  }
  type: 'poker-cash' | 'poker-tournament',
  state: 100 | 200 | 300, // Not Started | Running | Complete
  groupId: string;
}
```

Response Body: `Game`

#### PUT /games/:id

Updates a game

Request Body

```typescript
interface GameUpdateRequest {
  date: string | null;
  name: string | null;
  structure?: {
    bb?: number;
    sb?: number;
    maxBuyIn?: number;
    minBuyIn?: number;
  }
  state: 100 | 200 | 300, // Not Started | Running | Complete
}
```

Response Body: `Game`

#### DELETE /games/:id

Deletes a game

#### GET /games/:id/players

Retrieves the list of players for a game

Response Body: `Player[]`

#### POST /games/:id/players

Creates a player for a game

Request Body:

```typescript
interface PlayerCreateRequest {
  userId: string;
  buyIn: number | null;
  finalChipCount: number | null;
  maxChips: number | null;
  minChips: number | null;
}
```

Response Body: `Player`

#### PUT /games/:id/players/:userId

Updates a player in a game

```typescript
interface PlayerUpdateRequest {
  buyIn: number | null;
  finalChipCount: number | null;
  maxChips: number | null;
  minChips: number | null;
}
```

Response Body: `Player`

#### DELETE /:id/players/:userId

Removes a player in a game
