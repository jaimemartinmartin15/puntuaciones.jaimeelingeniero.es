# Game config view

This view allows to configure a new game or edit the configuration of a game in progress (detected by a parameter in the [routing configuration](../src/app/app.routes.ts)).

![game config](./images/game_config.png)

**(\*1)** Shown when _no_ edition mode, allows to select the game to play.

**(\*7)** Shown when _no_ edition mode, starts the game with the selected configuration.

**(\*8)** Shown when edition mode, confirms the changes in the configuration of the game in progress.

## Flags

### (*2) gameConfig:numberOfCards

If active, shows a control to select the number of cards.

**Properties**:

- numberOfCards: number
- numberOfCardsFormControl: FormControl&lt;number>

### (*3) gameConfig:limitScore

If active, shows a control to select the limit score of the game.

**Properties**:

- limitScore: number
- limitScoreFormControl: FormControl&lt;number>
- numberOfScrollers: number

### (*4) gameConfig:winner

If active, shows a control to select who wins the game.

**Properties**:

- winner: 'highestScore' | 'lowestScore'
- winnerFormControl: FormControl&lt;'highestScore' | 'lowestScore'>

### (*5) gameConfig:modality

If active, shows a control to select if the game is individual or by teams.

**Properties**:

- modality: 'individual' | 'teams'
- modalityFormControl: FormControl&lt;'individual' | 'teams'>

### (*6) gameConfig:players

If active, shows the controls to enter the player names and who is next turn.

**Properties**:

- allowEditTeamName: boolean[]
- teamControls: FormArray&lt;FormControl&lt;EnterPlayerNamesModel&gt;&gt;

### (*7) (*8) gameConfig:validation

If active, allows to disable buttons when the configuration is not correct to start or continue the game.

**Properties**:

- isGameConfigCorrect(): boolean

### (*7) (*8) gameConfig

Callbacks when the game starts or the configuration is edited.

**Properties**:

- onStartGame(): void
- onEditConfigCurrentGame(): void

### (*7) (*8) game:localStorageSave

If active, the configuration of last service is loaded on page load and saved in local storage on start or edit game.

**Properties**:

- saveStateToLocalStorage(): void
- loadStateFromLocalStorage(): void

## In GameService interface

**Properties**:

- **(\*1)** gameName: string
- **(\*7)** startGameRoute: RoutingPath

## Functional analysis

On page load:

- No edition mode: the last used game service is selected by default. If the flag is active, also the configuration is loaded from local storage.
- Edition mode: it is not possible to change the selected game. Show configuration of current game with last values in the form controls.

Depending on the selected game, the service will have different flags active and different forms are shown.

When the user presses the start button the configuration is optionally saved in local storage and the user is redirected to _startGameRoute_.

When the user presses the go back button the configuration is optionally saved in local storage and the user is redirected to the view the user came from.
