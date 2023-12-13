describe('Pocha game (4 players and 40 cards)', () => {
  it('Should allow to play a pocha game', () => {
    cy.visit('/');

    // configuration
    cy.enterPlayerNames([' Player 1', 'Player 2 ', ' Player 3 ', 'Player 4']);
    cy.get('[data-cy-test-id="start-button"]').click();
    cy.location('pathname').should('equals', '/ranking');

    // game just started
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 1',
      nextRoundNumber: '1',
      numberOfCardsToDealNextRound: '1',
      gameHasFinished: false,
    });
    cy.get('[data-cy-test-id="empty-state"]').contains('Introduce al menos una ronda para mostrar el ranking');

    /******************************************* ROUND 1 *******************************************/
    cy.enterScorePocha(1, [
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: 10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 2',
      nextRoundNumber: '2',
      numberOfCardsToDealNextRound: '2',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 2', totalScore: 10, lastRoundScore: 10, maximumReachedScore: 10 },
      { position: 2, playerName: 'Player 1', totalScore: 5, lastRoundScore: 5, maximumReachedScore: 5 },
      { position: 2, playerName: 'Player 3', totalScore: 5, lastRoundScore: 5, maximumReachedScore: 5 },
      { position: 4, playerName: 'Player 4', totalScore: -10, lastRoundScore: -10, maximumReachedScore: 0 },
    ]);

    /******************************************* ROUND 2 *******************************************/
    cy.enterScorePocha(2, [
      { name: 'Player 1', score: 10 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 3',
      nextRoundNumber: '3',
      numberOfCardsToDealNextRound: '3',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 1', totalScore: 15, lastRoundScore: 10, maximumReachedScore: 15 },
      { position: 1, playerName: 'Player 2', totalScore: 15, lastRoundScore: 5, maximumReachedScore: 15 },
      { position: 3, playerName: 'Player 3', totalScore: 10, lastRoundScore: 5, maximumReachedScore: 10 },
      { position: 4, playerName: 'Player 4', totalScore: -20, lastRoundScore: -10, maximumReachedScore: 0 },
    ]);

    /******************************************* ROUND 3 *******************************************/
    cy.enterScorePocha(3, [
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 4',
      nextRoundNumber: '4',
      numberOfCardsToDealNextRound: '4',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 1', totalScore: 35, lastRoundScore: 20, maximumReachedScore: 35 },
      { position: 2, playerName: 'Player 3', totalScore: 15, lastRoundScore: 5, maximumReachedScore: 15 },
      { position: 3, playerName: 'Player 2', totalScore: 5, lastRoundScore: -10, maximumReachedScore: 15 },
      { position: 4, playerName: 'Player 4', totalScore: -30, lastRoundScore: -10, maximumReachedScore: 0 },
    ]);

    /******************************************* ROUND 4 *******************************************/
    cy.enterScorePocha(4, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 1',
      nextRoundNumber: '5',
      numberOfCardsToDealNextRound: '5',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 1', totalScore: 25, lastRoundScore: -10, maximumReachedScore: 35 },
      { position: 2, playerName: 'Player 3', totalScore: 20, lastRoundScore: 5, maximumReachedScore: 20 },
      { position: 3, playerName: 'Player 2', totalScore: 10, lastRoundScore: 5, maximumReachedScore: 15 },
      { position: 4, playerName: 'Player 4', totalScore: -10, lastRoundScore: 20, maximumReachedScore: 0 },
    ]);

    /******************************************* ROUND 5 *******************************************/
    cy.enterScorePocha(5, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 2',
      nextRoundNumber: '6',
      numberOfCardsToDealNextRound: '6',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 2', totalScore: 30, lastRoundScore: 20, maximumReachedScore: 30 },
      { position: 2, playerName: 'Player 3', totalScore: 25, lastRoundScore: 5, maximumReachedScore: 25 },
      { position: 3, playerName: 'Player 1', totalScore: 15, lastRoundScore: -10, maximumReachedScore: 35 },
      { position: 4, playerName: 'Player 4', totalScore: 10, lastRoundScore: 20, maximumReachedScore: 10 },
    ]);

    /******************************************* ROUND 6 *******************************************/
    cy.enterScorePocha(6, [
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: 10 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: 30 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 3',
      nextRoundNumber: '7',
      numberOfCardsToDealNextRound: '7',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 2', totalScore: 40, lastRoundScore: 10, maximumReachedScore: 40 },
      { position: 1, playerName: 'Player 4', totalScore: 40, lastRoundScore: 30, maximumReachedScore: 40 },
      { position: 3, playerName: 'Player 1', totalScore: 20, lastRoundScore: 5, maximumReachedScore: 35 },
      { position: 4, playerName: 'Player 3', totalScore: 15, lastRoundScore: -10, maximumReachedScore: 25 },
    ]);

    /******************************************* ROUND 7 *******************************************/
    cy.enterScorePocha(7, [
      { name: 'Player 1', score: 10 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 20 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 4',
      nextRoundNumber: '8',
      numberOfCardsToDealNextRound: '8',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 4', totalScore: 60, lastRoundScore: 20, maximumReachedScore: 60 },
      { position: 2, playerName: 'Player 3', totalScore: 35, lastRoundScore: 20, maximumReachedScore: 35 },
      { position: 3, playerName: 'Player 2', totalScore: 30, lastRoundScore: -10, maximumReachedScore: 40 },
      { position: 3, playerName: 'Player 1', totalScore: 30, lastRoundScore: 10, maximumReachedScore: 35 },
    ]);

    /******************************************* ROUND 8 *******************************************/
    cy.enterScorePocha(8, [
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: 20 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 1',
      nextRoundNumber: '9',
      numberOfCardsToDealNextRound: '9',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 55, lastRoundScore: 20, maximumReachedScore: 55 },
      { position: 2, playerName: 'Player 4', totalScore: 50, lastRoundScore: -10, maximumReachedScore: 60 },
      { position: 2, playerName: 'Player 1', totalScore: 50, lastRoundScore: 20, maximumReachedScore: 50 },
      { position: 2, playerName: 'Player 2', totalScore: 50, lastRoundScore: 20, maximumReachedScore: 50 },
    ]);

    /******************************************* ROUND 9 *******************************************/
    cy.enterScorePocha(9, [
      { name: 'Player 1', score: 30 },
      { name: 'Player 2', score: -20 },
      { name: 'Player 3', score: 10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 2',
      nextRoundNumber: '10',
      numberOfCardsToDealNextRound: '10',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 1', totalScore: 80, lastRoundScore: 30, maximumReachedScore: 80 },
      { position: 2, playerName: 'Player 3', totalScore: 65, lastRoundScore: 10, maximumReachedScore: 65 },
      { position: 3, playerName: 'Player 4', totalScore: 40, lastRoundScore: -10, maximumReachedScore: 60 },
      { position: 4, playerName: 'Player 2', totalScore: 30, lastRoundScore: -20, maximumReachedScore: 50 },
    ]);

    /******************************************* ROUND 10 *******************************************/
    cy.enterScorePocha(10, [
      { name: 'Player 1', score: 40 },
      { name: 'Player 2', score: 30 },
      { name: 'Player 3', score: 30 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 3',
      nextRoundNumber: '11',
      numberOfCardsToDealNextRound: '10',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 1', totalScore: 120, lastRoundScore: 40, maximumReachedScore: 120 },
      { position: 2, playerName: 'Player 3', totalScore: 95, lastRoundScore: 30, maximumReachedScore: 95 },
      { position: 3, playerName: 'Player 2', totalScore: 60, lastRoundScore: 30, maximumReachedScore: 60 },
      { position: 4, playerName: 'Player 4', totalScore: 30, lastRoundScore: -10, maximumReachedScore: 60 },
    ]);

    /******************************************* ROUND 11 *******************************************/
    cy.enterScorePocha(11, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 30 },
      { name: 'Player 3', score: 30 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 4',
      nextRoundNumber: '12',
      numberOfCardsToDealNextRound: '10',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 125, lastRoundScore: 30, maximumReachedScore: 125 },
      { position: 2, playerName: 'Player 1', totalScore: 110, lastRoundScore: -10, maximumReachedScore: 120 },
      { position: 3, playerName: 'Player 2', totalScore: 90, lastRoundScore: 30, maximumReachedScore: 90 },
      { position: 4, playerName: 'Player 4', totalScore: 50, lastRoundScore: 20, maximumReachedScore: 60 },
    ]);

    /******************************************* ROUND 12 *******************************************/
    cy.enterScorePocha(12, [
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 40 },
      { name: 'Player 4', score: 50 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 1',
      nextRoundNumber: '13',
      numberOfCardsToDealNextRound: '10',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 165, lastRoundScore: 40, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 1', totalScore: 115, lastRoundScore: 5, maximumReachedScore: 120 },
      { position: 3, playerName: 'Player 4', totalScore: 100, lastRoundScore: 50, maximumReachedScore: 100 },
      { position: 4, playerName: 'Player 2', totalScore: 80, lastRoundScore: -10, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 13 *******************************************/
    cy.enterScorePocha(13, [
      { name: 'Player 1', score: -20 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 2',
      nextRoundNumber: '14',
      numberOfCardsToDealNextRound: '9',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 145, lastRoundScore: -20, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 4', totalScore: 105, lastRoundScore: 5, maximumReachedScore: 105 },
      { position: 3, playerName: 'Player 1', totalScore: 95, lastRoundScore: -20, maximumReachedScore: 120 },
      { position: 4, playerName: 'Player 2', totalScore: 70, lastRoundScore: -10, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 14 *******************************************/
    cy.enterScorePocha(14, [
      { name: 'Player 1', score: -20 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 3',
      nextRoundNumber: '15',
      numberOfCardsToDealNextRound: '8',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 135, lastRoundScore: -10, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 4', totalScore: 95, lastRoundScore: -10, maximumReachedScore: 105 },
      { position: 3, playerName: 'Player 1', totalScore: 75, lastRoundScore: -20, maximumReachedScore: 120 },
      { position: 4, playerName: 'Player 2', totalScore: 60, lastRoundScore: -10, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 15 *******************************************/
    cy.enterScorePocha(15, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 30 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: 10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 4',
      nextRoundNumber: '16',
      numberOfCardsToDealNextRound: '7',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 115, lastRoundScore: -20, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 4', totalScore: 105, lastRoundScore: 10, maximumReachedScore: 105 },
      { position: 3, playerName: 'Player 2', totalScore: 90, lastRoundScore: 30, maximumReachedScore: 90 },
      { position: 4, playerName: 'Player 1', totalScore: 65, lastRoundScore: -10, maximumReachedScore: 120 },
    ]);

    /******************************************* ROUND 16 *******************************************/
    cy.enterScorePocha(16, [
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -20 },
      { name: 'Player 3', score: 10 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 1',
      nextRoundNumber: '17',
      numberOfCardsToDealNextRound: '6',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 125, lastRoundScore: 10, maximumReachedScore: 165 },
      { position: 1, playerName: 'Player 4', totalScore: 125, lastRoundScore: 20, maximumReachedScore: 125 },
      { position: 3, playerName: 'Player 1', totalScore: 70, lastRoundScore: 5, maximumReachedScore: 120 },
      { position: 3, playerName: 'Player 2', totalScore: 70, lastRoundScore: -20, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 17 *******************************************/
    cy.enterScorePocha(17, [
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -20 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 2',
      nextRoundNumber: '18',
      numberOfCardsToDealNextRound: '5',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 115, lastRoundScore: -10, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 4', totalScore: 105, lastRoundScore: -20, maximumReachedScore: 125 },
      { position: 3, playerName: 'Player 1', totalScore: 90, lastRoundScore: 20, maximumReachedScore: 120 },
      { position: 3, playerName: 'Player 2', totalScore: 90, lastRoundScore: 20, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 18 *******************************************/
    cy.enterScorePocha(18, [
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 3',
      nextRoundNumber: '19',
      numberOfCardsToDealNextRound: '4',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 4', totalScore: 110, lastRoundScore: 5, maximumReachedScore: 125 },
      { position: 2, playerName: 'Player 3', totalScore: 95, lastRoundScore: -20, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 1', totalScore: 95, lastRoundScore: 5, maximumReachedScore: 120 },
      { position: 4, playerName: 'Player 2', totalScore: 80, lastRoundScore: -10, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 19 *******************************************/
    cy.enterScorePocha(19, [
      { name: 'Player 1', score: 10 },
      { name: 'Player 2', score: 10 },
      { name: 'Player 3', score: 20 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 4',
      nextRoundNumber: '20',
      numberOfCardsToDealNextRound: '3',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 115, lastRoundScore: 20, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 1', totalScore: 105, lastRoundScore: 10, maximumReachedScore: 120 },
      { position: 3, playerName: 'Player 4', totalScore: 100, lastRoundScore: -10, maximumReachedScore: 125 },
      { position: 4, playerName: 'Player 2', totalScore: 90, lastRoundScore: 10, maximumReachedScore: 90 },
    ]);

    /******************************************* ROUND 20 *******************************************/
    cy.enterScorePocha(20, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 1',
      nextRoundNumber: '21',
      numberOfCardsToDealNextRound: '2',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 105, lastRoundScore: -10, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 1', totalScore: 95, lastRoundScore: -10, maximumReachedScore: 120 },
      { position: 2, playerName: 'Player 2', totalScore: 95, lastRoundScore: 5, maximumReachedScore: 95 },
      { position: 4, playerName: 'Player 4', totalScore: 90, lastRoundScore: -10, maximumReachedScore: 125 },
    ]);

    /******************************************* ROUND 21 *******************************************/
    cy.enterScorePocha(21, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 2',
      nextRoundNumber: '22',
      numberOfCardsToDealNextRound: '1',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 95, lastRoundScore: -10, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 1', totalScore: 85, lastRoundScore: -10, maximumReachedScore: 120 },
      { position: 2, playerName: 'Player 2', totalScore: 85, lastRoundScore: -10, maximumReachedScore: 95 },
      { position: 4, playerName: 'Player 4', totalScore: 80, lastRoundScore: -10, maximumReachedScore: 125 },
    ]);

    /******************************************* ROUND 22 *******************************************/
    cy.enterScorePocha(22, [
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      playerNameThatDeals: 'Player 3',
      nextRoundNumber: '23',
      numberOfCardsToDealNextRound: '1 (frente)',
      gameHasFinished: false,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 100, lastRoundScore: 5, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 1', totalScore: 90, lastRoundScore: 5, maximumReachedScore: 120 },
      { position: 2, playerName: 'Player 2', totalScore: 90, lastRoundScore: 5, maximumReachedScore: 95 },
      { position: 4, playerName: 'Player 4', totalScore: 70, lastRoundScore: -10, maximumReachedScore: 125 },
    ]);

    /******************************************* ROUND 23 *******************************************/
    cy.enterScorePocha(23, [
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.verifyRoundInfo({
      gameName: 'Pocha',
      gameHasFinished: true,
    });
    cy.verifyAllPlayerDisplays([
      { position: 1, playerName: 'Player 3', totalScore: 105, lastRoundScore: 5, maximumReachedScore: 165 },
      { position: 2, playerName: 'Player 2', totalScore: 95, lastRoundScore: 5, maximumReachedScore: 95 },
      { position: 3, playerName: 'Player 1', totalScore: 80, lastRoundScore: -10, maximumReachedScore: 120 },
      { position: 4, playerName: 'Player 4', totalScore: 60, lastRoundScore: -10, maximumReachedScore: 125 },
    ]);
  });
});
