# Ranking view

![ranking view](./images/ranking.png)

## Flags

### ranking

Allows to show the players in the correct order.

**Properties**:

- getRankingPlayers(round?: number): Player[]

These are to display a single player:

- getPlayerPosition: (playerId: number) => number
- getScoreLastRound: (playerId: number) => number
- getPlayerName: (playerId: number) => string
- getTotalScore: (playerId: number) => number

### (*1) ranking:playerDisplay:maximumReachedScore

Allows to show the highest score that the player has reached during the game.

**Properties**:

- getMaximumReachedScore: (playerId: number) => number

### (*2) ranking:playerDisplay:numberOfRejoins

Allows to show the number of times the player rejoined the game.

**Properties**:

- getNumberOfRejoins: (playerId: number) => number

## In GameService interface

**Properties**:

- gameHasStarted(): boolean
- get players(): Player[]
- enterScoreRoute: RoutingPath
- getNextRoundNumber(): number
