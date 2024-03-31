# Scoreboard view

![scoreboard view](./images/scoreboard.png)

## Flags

### scoreboard

Allows to show the scoreboard view.

**Properties**:

- getPlayerAccumulatedScoreAtRound: (playerId: number, round: number) => number
- getCellBackgroundColor: (score: number) => string
- getTotalScore: (playerId: number) => number

### (*1) scoreboard:specialRounds

Allows to show special rows in the table.

**Properties**:

- showSpecialRowAfterRound: (round: number) => boolean
- getSpecialRoundScores: (round: number) => number[]
- getPlayerAccumulatedScoreAtSpecialRound: (playerId: number, round: number) => number

## In GameService interface

**Properties**:

- gameHasStarted(): boolean
- get players(): Player[]
- enterScoreRoute: RoutingPath
- getNextRoundNumber(): number
