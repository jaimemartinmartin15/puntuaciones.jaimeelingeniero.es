declare namespace Cypress {
  interface Chainable<Subject = any> {
    enterScorePocha(players: { name: string; score: number }[]): typeof enterScorePocha;
  }
}

function enterScorePocha(players: { name: string; score: number }[]): void {
  cy.get('[data-cy-test-id="bt-new-round"]').click();

  players.forEach((p) => {
    if (p.score >= -30 && p.score <= 60 && p.score !== 5) {
      cy.get(`[data-cy-test-id="bt-${p.score}"]`).click();
    }

    cy.get('[data-cy-test-id="bt-next-player"]').click();
  });
}

Cypress.Commands.add('enterScorePocha', enterScorePocha);
