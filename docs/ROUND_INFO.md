# Round info component

This component gives additional information about the game and the current round.

![round info](./images/round_info_1.png)

![round info](./images/round_info_2.png)

## Flags

### (*6) game:gameStartEnd

Allows to indicate when the game has finished.

**Properties**:

- gameHasFinished: () => boolean

### (*2) game:rounds

Allows to show the next round number.

**Properties**:

- getNextRoundNumber: () => number

### (*1) roundInfo:gameName

If active, shows the game name.

**Properties**:

- gameName: string

### (*3) roundInfo:dealingPlayer

If active, shows the player that deals in next round.

**Properties**:

- getPlayerNameThatDeals: () => string

### (*4) roundInfo:numberOfCards

If active, shows the number of cards to deal in next round.

**Properties**:

- getNumberOfCardsToDealNextRound: () => string

### (*5) roundInfo:limitScore

If active, shows the limit score of the game.

**Properties**:

- limitScore: number

## Functional analysis

When the user clicks the component, it is allowed to edit the configuration.
