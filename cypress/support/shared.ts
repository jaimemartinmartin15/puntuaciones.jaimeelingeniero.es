// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable<Subject = any> {
    enterPlayerNames(names: string[]): typeof enterPlayerNames;
    verifyRoundInfo(data: {
      gameName?: string;
      nextRoundNumber?: string;
      playerNameThatDeals?: string;
      numberOfCardsToDealNextRound?: string;
      limitScore?: string;
      gameHasFinished?: boolean;
    }): typeof verifyRoundInfo;
    verifyPlayerDisplay(
      playerDisplayIndex: number,
      data: {
        position: number;
        playerName: string;
        totalScore: number;
        lastRoundScore: number;
        maximumReachedScore?: number;
        numberOfRejoins?: number;
      }
    ): typeof verifyPlayerDisplay;
    verifyAllPlayerDisplays(
      data: {
        position: number;
        playerName: string;
        totalScore: number;
        lastRoundScore: number;
        maximumReachedScore?: number;
        numberOfRejoins?: number;
      }[]
    ): typeof verifyPlayerDisplay;
  }
}

function enterPlayerNames(names: string[]): void {
  for (let i = 0; i < names.length; i++) {
    cy.get('[data-cy-test-id="player-name-inputs"]').eq(i).type(names[i]);
  }
}

function verifyRoundInfo(data: {
  gameName?: string;
  nextRoundNumber?: string;
  playerNameThatDeals?: string;
  numberOfCardsToDealNextRound?: string;
  limitScore?: string;
  gameHasFinished?: boolean;
}): void {
  if (data.gameName !== undefined) {
    cy.get('app-round-info [data-cy-test-id="round-info-game-name"]').contains(data.gameName);
  } else {
    cy.get('app-round-info [data-cy-test-id="round-info-game-name"]').should('not.exist');
  }

  if (data.gameHasFinished) {
    cy.get('app-round-info [data-cy-test-id="round-info-game-has-finished"]').contains('Fin de la partida');
  } else {
    cy.get('app-round-info [data-cy-test-id="round-info-game-has-finished"]').should('not.exist');
    cy.get('app-round-info [data-cy-test-id="round-info-next-round-number"]').contains(`Ronda: ${data.nextRoundNumber}`);
    cy.get('app-round-info [data-cy-test-id="round-info-player-name-that-deals"]').contains(`Reparte: ${data.playerNameThatDeals}`);

    if (data.numberOfCardsToDealNextRound !== undefined) {
      cy.get('app-round-info [data-cy-test-id="round-info-number-of-cards-to-deal-next-round"]').contains(
        `Cartas: ${data.numberOfCardsToDealNextRound}`
      );
    } else {
      cy.get('app-round-info [data-cy-test-id="round-info-number-of-cards-to-deal-next-round"]').should('not.exist');
    }

    if (data.limitScore !== undefined) {
      cy.get('app-round-info [data-cy-test-id="round-info-limit-score"]').contains(`Limite: ${data.limitScore}`);
    } else {
      cy.get('app-round-info [data-cy-test-id="round-info-limit-score"]').should('not.exist');
    }
  }
}

function verifyPlayerDisplay(
  playerDisplayIndex: number,
  data: {
    position: number;
    playerName: string;
    totalScore: number;
    lastRoundScore: number;
    maximumReachedScore?: number;
    numberOfRejoins?: number;
  }
): void {
  cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="player-position"]').contains(data.position);
  cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="name-and-score"]').contains(data.playerName);
  cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="name-and-score"]').contains(data.totalScore);
  cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="last-round-score"]').contains(data.lastRoundScore);

  if (data.maximumReachedScore !== undefined) {
    cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="maximum-reached-score"]').contains(data.maximumReachedScore);
  } else {
    cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="maximum-reached-score"]').should('not.exist');
  }

  if (data.numberOfRejoins !== undefined) {
    cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="number-of-rejoins"]').contains(data.numberOfRejoins);
  } else {
    cy.get('[data-cy-test-id="player"]').eq(playerDisplayIndex).find('[data-cy-test-id="number-of-rejoins"]').should('not.exist');
  }
}

function verifyAllPlayerDisplays(
  playersData: {
    position: number;
    playerName: string;
    totalScore: number;
    lastRoundScore: number;
    maximumReachedScore?: number;
    numberOfRejoins?: number;
  }[]
): void {
  playersData.forEach((p, i) => {
    cy.verifyPlayerDisplay(i, p);
  });
}

Cypress.Commands.add('enterPlayerNames', enterPlayerNames);
Cypress.Commands.add('verifyRoundInfo', verifyRoundInfo);
Cypress.Commands.add('verifyPlayerDisplay', verifyPlayerDisplay);
Cypress.Commands.add('verifyAllPlayerDisplays', verifyAllPlayerDisplays);
