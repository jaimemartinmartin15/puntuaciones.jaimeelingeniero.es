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

  describe('Pocha game', () => {
    let service: PochaService;

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
      const gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as PochaService;
      service.numberOfCards = 4;
      service.players = [
        { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement;
      expect(gameName.textContent).toEqual('Pocha');
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      service.players = [
        { id: 0, name: 'Player 1', scores: [5], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [-10], punctuation: 0 },
      ];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      service.dealingPlayerIndex = 1;
      fixture.detectChanges();
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 2');
    });

    it('should show the number of cards to deal in next round', () => {
      const numberOfCardsToDeal = fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_CARDS_TO_DEAL_NEXT_ROUND)).nativeElement;
      expect(numberOfCardsToDeal.textContent).toContain('Cartas: 1');
    });

    it('should show the number of cards to deal in last round', () => {
      service.players = [
        { id: 0, name: 'Player 1', scores: [-10, -10, 20, -10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [5, 10, -10, 5], punctuation: 0 },
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
      service.numberOfCards = 4;
      service.players = [
        { id: 0, name: 'Player 1', scores: [-10, -10, 20, -10, -10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [5, 10, -10, 5, 5], punctuation: 0 },
      ];
      fixture.detectChanges();

      const gameHasFinished = fixture.debugElement.query(By.css(SELECTORS.GAME_HAS_FINISHED)).nativeElement;
      expect(gameHasFinished.textContent.length).toBeGreaterThan(5); // whatever number, just check it is not empty
    });
  });

  describe('Chinchón game', () => {
    let service: ChinchonService;

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
      const gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as ChinchonService;
      service.players = [
        { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement;
      expect(gameName.textContent).toEqual('Chinchón');
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      service.players = [
        { id: 0, name: 'Player 1', scores: [23], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [7], punctuation: 0 },
      ];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      service.dealingPlayerIndex = 1;
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

      service.limitScore = 60;
      fixture.detectChanges();
      expect(limitScore.textContent).toContain('Límite: 60');
    });

    it('should show if the game has finished', () => {
      service.players = [
        { id: 0, name: 'Player 1', scores: [70, 35], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [75, 8], punctuation: 0 },
      ];
      fixture.detectChanges();

      const gameHasFinished = fixture.debugElement.query(By.css(SELECTORS.GAME_HAS_FINISHED)).nativeElement;
      expect(gameHasFinished.textContent.length).toBeGreaterThan(5); // whatever number, just check it is not empty
    });
  });

  describe('Other game', () => {
    let service: OtherGameService;

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
      const gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as OtherGameService;
      service.players = [
        { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should not show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME));
      expect(gameName).toBeNull();
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      service.players = [
        { id: 0, name: 'Player 1', scores: [23], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [7], punctuation: 0 },
      ];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      service.dealingPlayerIndex = 1;
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
    let service: BriscaService;

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
      const gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as BriscaService;
      service.playerNames = ['Player 1', 'Player 2'];
      fixture = TestBed.createComponent(RoundInfoComponent);
    });

    it('should show the game name', () => {
      const gameName = fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement;
      expect(gameName.textContent).toEqual('Brisca');
    });

    it('should show the next round number', () => {
      const nextRoundNumber = fixture.debugElement.query(By.css(SELECTORS.NEXT_ROUND_NUMBER)).nativeElement;
      expect(nextRoundNumber.textContent).toContain('Ronda: 1');

      service.scores = [0, 1];
      fixture.detectChanges();
      expect(nextRoundNumber.textContent).toContain('Ronda: 2');
    });

    it('should show the player name that deals', () => {
      const playerNameThatDeals = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_THAT_DEALS)).nativeElement;
      expect(playerNameThatDeals.textContent).toContain('Reparte: Player 1');

      service.setNextDealingPlayer();
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
