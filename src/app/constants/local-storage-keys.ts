export const LOCAL_STORE_KEYS = {
  /**
   * Time when the user presses start game in game config view
   */
  TIME_GAME_STARTS: `timeGameStarts`,

  /**
   * Time when the user presses start game in game config view, or after entering a round
   */
  TIME_LAST_INTERACTION: `timeLastGame`,

  /**
   * The name of the game that was played last time. Used to resume a game
   */
  SAVED_GAME_NAME: `savedGameName`,

  /**
   * State of a game service: players, scores, limit score, number of cards, etc.
   * Saved when starting a new game, or entering a new round.
   * Loaded when resuming a game or starting the app (with last used config).
   *
   * @param gameName The name of the game
   */
  SETTINGS: (gameName: string) => `settings-${gameName}`,

  /**
   * Last time the delete banner was shown in brisca component, just after closing it
   */
  BRISCA_LAST_TIME_DELETE_BANNER: 'briscaLastTimeDeleteBanner',
};
