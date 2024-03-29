# Bottom controls component

![bottom controls](./images/bottom_controls_1.png)

## Flags

### (*2) bottomControls:changeViews

Shows the button that opens a pop up that allows to change to different views for the game.

**Properties**:

- changeViews: { path: RoutingPath; display: string }[]

## In GameService interface

### (*3) New round

Navigates to the view that allows to enter the score of a new round.

**Properties**:

- enterScoreRoute: RoutingPath

- get players(): Player[]

- getNextRoundNumber(): number
