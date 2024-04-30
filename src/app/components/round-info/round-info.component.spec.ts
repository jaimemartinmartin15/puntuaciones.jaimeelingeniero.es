import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { BriscaService } from '../../game-services/brisca.service';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { RoundInfoComponent } from './round-info.component';

const SELECTORS = {
  GAME_NAME: '[data-test-id="game-name"]',
  NEXT_ROUND_NUMBER: '[data-test-id="next-round-number"]',
  PLAYER_NAME_THAT_DEALS: '[data-test-id="player-name-that-deals"]',
  NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND: '[data-test-id="number-of-cards-to-deal-next-round"]',
  LIMIT_SCORE: '[data-test-id="limit-score"]',
  GAME_HAS_FINISHED: '[data-test-id="game-has-finished"]',
} as const;

describe('RoundInfoComponent', () => {
  let fixture: ComponentFixture<RoundInfoComponent>;
  let gameService: any; // * allow to set private variables in services

  describe('Pocha game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RoundInfoComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
      gameService.numberOfCards = 4;
      gameService.playerNames = ['Player 1', 'Player 2'];
      gameService.scores = [[], []];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement;
      expect(gameName.textContent).toEqual('Pocha');
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      gameService.scores = [[5], [-10]];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      gameService.dealingPlayerIndex = 1;
      fixture.detectChanges();
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 2');
    });

    it('should show the number of cards to deal in next round', () => {
      const numberOfCardsToDeal = fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND)).nativeElement;
      expect(numberOfCardsToDeal.textContent).toContain('Cartas: 1');
    });

    it('should show the number of cards to deal in last round', () => {
      gameService.scores = [
        [-10, -10, 20, -10],
        [5, 10, -10, 5],
      ];
      fixture.detectChanges();

      const numberOfCardsToDeal = fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND)).nativeElement;
      expect(numberOfCardsToDeal.textContent).toContain('Cartas: 1 (frente)');
    });

    it('should not show the limit score', () => {
      const limitScore = fixture.debugElement.query(By.css(SELECTORS.LIMIT_SCORE));
      expect(limitScore).toBeNull();
    });

    it('should show if the game has finished', () => {
      gameService.numberOfCards = 4;
      gameService.scores = [
        [-10, -10, 20, -10, -10],
        [5, 10, -10, 5, 5],
      ];
      fixture.detectChanges();

      const gameHasFinished = fixture.debugElement.query(By.css(SELECTORS.GAME_HAS_FINISHED)).nativeElement;
      expect(gameHasFinished.textContent.length).toBeGreaterThan(5); // whatever number, just check it is not empty
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RoundInfoComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(ChinchonService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2'];
      gameService.scores = [[], []];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement;
      expect(gameName.textContent).toEqual('Chinchón');
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      gameService.scores = [[23], [7]];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      gameService.dealingPlayerIndex = 1;
      fixture.detectChanges();
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 2');
    });

    it('should not show the number of cards to deal in next round', () => {
      const numberOfCardsToDeal = fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND));
      expect(numberOfCardsToDeal).toBeNull();
    });

    it('should show the limit score', () => {
      const limitScore = fixture.debugElement.query(By.css(SELECTORS.LIMIT_SCORE)).nativeElement;
      expect(limitScore.textContent).toContain('Límite: 100');

      gameService.limitScore = 60;
      fixture.detectChanges();
      expect(limitScore.textContent).toContain('Límite: 60');
    });

    it('should show if the game has finished', () => {
      gameService.scores = [
        [70, 35],
        [75, 8],
      ];
      fixture.detectChanges();

      const gameHasFinished = fixture.debugElement.query(By.css(SELECTORS.GAME_HAS_FINISHED)).nativeElement;
      expect(gameHasFinished.textContent.length).toBeGreaterThan(5); // whatever number, just check it is not empty
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RoundInfoComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(OtherGameService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2'];
      gameService.scores = [[], []];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should not show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME));
      expect(gameName).toBeNull();
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      gameService.scores = [[23], [7]];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      gameService.dealingPlayerIndex = 1;
      fixture.detectChanges();
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 2');
    });

    it('should not show the number of cards to deal in next round', () => {
      const numberOfCardsToDeal = fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND));
      expect(numberOfCardsToDeal).toBeNull();
    });

    it('should not show the limit score', () => {
      const limitScore = fixture.debugElement.query(By.css(SELECTORS.LIMIT_SCORE));
      expect(limitScore).toBeNull();
    });

    it('should not show if the game has finished', () => {
      const gameHasFinished = fixture.debugElement.query(By.css(SELECTORS.GAME_HAS_FINISHED));
      expect(gameHasFinished).toBeNull();
    });
  });

  describe('Brisca game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RoundInfoComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(BriscaService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2'];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement;
      expect(gameName.textContent).toEqual('Brisca');
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      gameService.scores = [0, 1];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      gameService.setNextDealingPlayer();
      fixture.detectChanges();
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 2');
    });

    it('should not show the number of cards', () => {
      const numberOfCards = fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND));
      expect(numberOfCards).toBeNull();
    });

    it('should not show the limit score', () => {
      const limitScore = fixture.debugElement.query(By.css(SELECTORS.LIMIT_SCORE));
      expect(limitScore).toBeNull();
    });

    it('should not show if the game has finished', () => {
      const gameHasFinished = fixture.debugElement.query(By.css(SELECTORS.GAME_HAS_FINISHED));
      expect(gameHasFinished).toBeNull();
    });
  });
});
