describe('Pocha game', () => {
  it('Should allow to play a pocha game', () => {
    cy.visit('/');

    // configuration
    cy.enterPlayerNames([' Player 1', 'Player 2 ', ' Player 3 ', 'Player 4']);
    cy.screenshot('pocha/game config');

    // game started
    cy.get('[data-test-id="btn-start"]').click();
    cy.location('pathname').should('equals', '/ranking');
    cy.screenshot('pocha/game started');

    /******************************************* ROUND 1 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.screenshot('pocha/ranking round 1');

    /******************************************* ROUND 2 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -20 },
      { name: 'Player 3', score: 10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 2');

    /******************************************* ROUND 3 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 10 },
    ]);
    cy.screenshot('pocha/ranking round 3');

    /******************************************* ROUND 4 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 10 },
    ]);
    cy.screenshot('pocha/ranking round 4');

    /******************************************* ROUND 5 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: 10 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 5');

    /******************************************* ROUND 6 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 30 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.screenshot('pocha/ranking round 6');

    /******************************************* ROUND 7 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.screenshot('pocha/ranking round 7');

    /******************************************* ROUND 8 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: 10 },
    ]);
    cy.screenshot('pocha/ranking round 8');

    /******************************************* ROUND 9 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: 10 },
    ]);
    cy.screenshot('pocha/ranking round 9');

    /******************************************* ROUND 10 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: -20 },
      { name: 'Player 3', score: 30 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.screenshot('pocha/ranking round 10');

    /******************************************* ROUND 11 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 10 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 11');

    /******************************************* ROUND 12 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 40 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 20 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 12');

    /******************************************* ROUND 13 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: 40 },
    ]);
    cy.screenshot('pocha/ranking round 13');

    /******************************************* ROUND 14 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: -20 },
      { name: 'Player 3', score: 20 },
      { name: 'Player 4', score: 20 },
    ]);
    cy.screenshot('pocha/ranking round 14');

    /******************************************* ROUND 15 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 10 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 15');

    /******************************************* ROUND 16 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 20 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 16');

    /******************************************* ROUND 17 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 10 },
      { name: 'Player 2', score: -10 },
      { name: 'Player 3', score: 10 },
      { name: 'Player 4', score: -20 },
    ]);
    cy.screenshot('pocha/ranking round 17');

    /******************************************* ROUND 18 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: -10 },
    ]);
    cy.screenshot('pocha/ranking round 18');

    /******************************************* ROUND 19 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: -20 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.screenshot('pocha/ranking round 19');

    /******************************************* ROUND 20 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: 5 },
      { name: 'Player 2', score: 20 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: -20 },
    ]);
    cy.screenshot('pocha/ranking round 20');

    /******************************************* ROUND 21 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -20 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: -10 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.screenshot('pocha/ranking round 21');

    /******************************************* ROUND 22 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 5 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.screenshot('pocha/ranking round 22');

    /******************************************* ROUND 23 *******************************************/
    cy.enterScorePocha([
      { name: 'Player 1', score: -10 },
      { name: 'Player 2', score: 10 },
      { name: 'Player 3', score: 5 },
      { name: 'Player 4', score: 5 },
    ]);
    cy.screenshot('pocha/ranking round 23');

    // change to scoreboard view
    cy.get('[data-test-id="btn-change-view"]').click();
    cy.get('[data-test-id="change-view-pop-up"]').contains('Tabla').click();
    cy.location('pathname').should('equals', '/tabla');
    cy.get('app-scoreboard [data-test-id="scoreboard"]').screenshot('pocha/scoreboard', {capture: 'fullPage'});

    // change to statistics view
    cy.get('[data-test-id="btn-change-view"]').click();
    cy.get('[data-test-id="change-view-pop-up"]').contains('Estadísticas').click();
    cy.location('pathname').should('equals', '/estadisticas');
    cy.get('app-statistics [data-test-id="statistics"]').screenshot('pocha/statistics', {capture: 'fullPage'});
  });
});
