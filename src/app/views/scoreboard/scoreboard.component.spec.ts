import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { ROUTING_PATHS } from '../../constants/routes';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { ScoreboardComponent } from './scoreboard.component';

const SELECTORS = {
  EMPTY_MESSAGE: '[data-test-id="empty-state"]',
  TOP_ROW_HEADER: '[data-test-id="top-row-header"]',
  ROUND_NUMBER: (roundNumber: number) => `[data-test-id="round-number-${roundNumber}"]`,
  TABLE_CELL_PLAYER_ROUND: (playerId: number, roundNumber: number) => `[data-test-id="table-cell-player-${playerId}-round-${roundNumber}"]`,
  SCORE_PLAYER: (playerId: number, roundNumber: number) => `[data-test-id="score-player-${playerId}-round-${roundNumber}"]`,
  ACCUMULATED_SCORE_PLAYER: (playerId: number, roundNumber: number) => `[data-test-id="accumulated-score-player-${playerId}-round-${roundNumber}"]`,
  SPECIAL_SCORE_PLAYER: (playerId: number, roundNumber: number) => `[data-test-id="special-score-player-${playerId}-round-${roundNumber}"]`,
  ACCUMULATED_SPECIAL_SCORE_PLAYER: (playerId: number, roundNumber: number) =>
    `[data-test-id="accumulated-special-score-player-${playerId}-round-${roundNumber}"]`,
  TOTAL_SCORE_PLAYER: (playerId: number) => `[data-test-id="total-score-player-${playerId}"]`,
} as const;

describe('ScoreboardComponent', () => {
  let fixture: ComponentFixture<ScoreboardComponent>;
  let gameHolderService: GameHolderService;
  let navigateSpy: jasmine.Spy;

  describe('Pocha game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ScoreboardComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [5, 5, 5], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [-10, -20, -10], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [5, 10, 5], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [5, -10, 10], punctuation: 0 },
      ];
      navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      fixture = TestBed.createComponent(ScoreboardComponent);
    });

    it('should show player names', () => {
      const playerNames = fixture.debugElement.query(By.css(SELECTORS.TOP_ROW_HEADER)).nativeElement.textContent;
      expect(playerNames).toEqual('RondaPlayer 1Player 2Player 3Player 4');
    });

    it('should show round number and allows to change scores', () => {
      const roundNumberEl = fixture.debugElement.query(By.css(SELECTORS.ROUND_NUMBER(2))).nativeElement;
      expect(roundNumberEl.textContent).toContain('3');

      roundNumberEl.click();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE_POCHA],
        jasmine.objectContaining({
          state: {
            roundNumber: 3,
            players: [
              { id: 0, name: 'Player 1', scores: [5, 5, 5], punctuation: 5 },
              { id: 1, name: 'Player 2', scores: [-10, -20, -10], punctuation: -10 },
              { id: 2, name: 'Player 3', scores: [5, 10, 5], punctuation: 5 },
              { id: 3, name: 'Player 4', scores: [5, -10, 10], punctuation: 10 },
            ],
          },
        })
      );
    });

    it('should show player scores and allows to change it', () => {
      const playerScoreEl = fixture.debugElement.query(By.css(SELECTORS.SCORE_PLAYER(1, 1))).nativeElement;
      expect(playerScoreEl.textContent).toContain('-20');

      playerScoreEl.click();
      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE_POCHA],
        jasmine.objectContaining({
          state: {
            roundNumber: 2,
            players: [{ id: 1, name: 'Player 2', scores: [-10, -20, -10], punctuation: -20 }],
          },
        })
      );
    });

    it('should show accumulated scores', () => {
      let accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SCORE_PLAYER(1, 1))).nativeElement.textContent;
      expect(accumulatedScore).toContain('-30');

      accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SCORE_PLAYER(0, 2))).nativeElement.textContent;
      expect(accumulatedScore).toContain('15');

      accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SCORE_PLAYER(3, 2))).nativeElement.textContent;
      expect(accumulatedScore).toContain('5');
    });

    it('should show colors for scores', () => {
      let tableCellEl = fixture.debugElement.query(By.css(SELECTORS.TABLE_CELL_PLAYER_ROUND(1, 0))).nativeElement;
      expect(tableCellEl.style.backgroundColor).toContain('rgb(255, 165, 165)');

      tableCellEl = fixture.debugElement.query(By.css(SELECTORS.TABLE_CELL_PLAYER_ROUND(1, 1))).nativeElement;
      expect(tableCellEl.style.backgroundColor).toContain('rgb(255, 75, 75)');

      tableCellEl = fixture.debugElement.query(By.css(SELECTORS.TABLE_CELL_PLAYER_ROUND(0, 0))).nativeElement;
      expect(tableCellEl.style.backgroundColor).toContain('rgb(165, 255, 165)');

      tableCellEl = fixture.debugElement.query(By.css(SELECTORS.TABLE_CELL_PLAYER_ROUND(3, 2))).nativeElement;
      expect(tableCellEl.style.backgroundColor).toContain('rgb(75, 255, 75)');
    });

    it('should show total scores', () => {
      let totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(0))).nativeElement.textContent;
      expect(totalScore).toContain('15');

      totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(1))).nativeElement.textContent;
      expect(totalScore).toContain('-40');

      totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(2))).nativeElement.textContent;
      expect(totalScore).toContain('20');

      totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(3))).nativeElement.textContent;
      expect(totalScore).toContain('5');
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ScoreboardComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(ChinchonService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [2, 30, 15], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [32, 5, -10], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [23, 2, 42], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [50, 60, 80], punctuation: 0 },
      ];
      navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      fixture = TestBed.createComponent(ScoreboardComponent);
    });

    it('should show player names', () => {
      const playerNames = fixture.debugElement.query(By.css(SELECTORS.TOP_ROW_HEADER)).nativeElement.textContent;
      expect(playerNames).toEqual('RondaPlayer 1Player 2Player 3Player 4');
    });

    it('should show round number and allows to change scores', () => {
      const roundNumberEl = fixture.debugElement.query(By.css(SELECTORS.ROUND_NUMBER(2))).nativeElement;
      expect(roundNumberEl.textContent).toContain('3');

      roundNumberEl.click();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE],
        jasmine.objectContaining({
          state: {
            roundNumber: 3,
            players: [
              { id: 0, name: 'Player 1', scores: [2, 30, 15], punctuation: 15 },
              { id: 1, name: 'Player 2', scores: [32, 5, -10], punctuation: -10 },
              { id: 2, name: 'Player 3', scores: [23, 2, 42], punctuation: 42 },
              { id: 3, name: 'Player 4', scores: [50, 60, 80], punctuation: 80 },
            ],
          },
        })
      );
    });

    it('should show player scores and allows to change it', () => {
      const playerScoreEl = fixture.debugElement.query(By.css(SELECTORS.SCORE_PLAYER(1, 1))).nativeElement;
      expect(playerScoreEl.textContent).toContain('5');

      playerScoreEl.click();
      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE],
        jasmine.objectContaining({
          state: {
            roundNumber: 2,
            players: [{ id: 1, name: 'Player 2', scores: [32, 5, -10], punctuation: 5 }],
          },
        })
      );
    });

    it('should show accumulated scores', () => {
      let accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SCORE_PLAYER(1, 1))).nativeElement.textContent;
      expect(accumulatedScore).toContain('37');

      accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SCORE_PLAYER(0, 2))).nativeElement.textContent;
      expect(accumulatedScore).toContain('47');

      accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SCORE_PLAYER(3, 2))).nativeElement.textContent;
      expect(accumulatedScore).toContain('117');
    });

    it('should show special rounds', () => {
      let playerScore = fixture.debugElement.query(By.css(SELECTORS.SPECIAL_SCORE_PLAYER(3, 1))).nativeElement.textContent;
      expect(playerScore).toContain('-73');

      let accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SPECIAL_SCORE_PLAYER(3, 1))).nativeElement.textContent;
      expect(accumulatedScore).toContain('37');

      playerScore = fixture.debugElement.query(By.css(SELECTORS.SPECIAL_SCORE_PLAYER(3, 2))).nativeElement.textContent;
      expect(playerScore).toContain('-50');

      accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SPECIAL_SCORE_PLAYER(3, 2))).nativeElement.textContent;
      expect(accumulatedScore).toContain('67');

      playerScore = fixture.debugElement.query(By.css(SELECTORS.SPECIAL_SCORE_PLAYER(1, 1))).nativeElement.textContent;
      expect(playerScore).toEqual('');

      accumulatedScore = fixture.debugElement.query(By.css(SELECTORS.ACCUMULATED_SPECIAL_SCORE_PLAYER(0, 0)));
      expect(accumulatedScore).toBeNull();
    });

    it('should show colors for scores', () => {
      let tableCellEl = fixture.debugElement.query(By.css(SELECTORS.TABLE_CELL_PLAYER_ROUND(1, 0))).nativeElement;
      expect(tableCellEl.style.backgroundColor).toContain('rgb(248, 200, 200)');

      tableCellEl = fixture.debugElement.query(By.css(SELECTORS.TABLE_CELL_PLAYER_ROUND(1, 2))).nativeElement;
      expect(tableCellEl.style.backgroundColor).toContain('rgb(179, 255, 179)');
    });

    it('should show total scores', () => {
      let totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(0))).nativeElement.textContent;
      expect(totalScore).toContain('47');

      totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(1))).nativeElement.textContent;
      expect(totalScore).toContain('27');

      totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(2))).nativeElement.textContent;
      expect(totalScore).toContain('67');

      totalScore = fixture.debugElement.query(By.css(SELECTORS.TOTAL_SCORE_PLAYER(3))).nativeElement.textContent;
      expect(totalScore).toContain('67');
    });
  });
});
