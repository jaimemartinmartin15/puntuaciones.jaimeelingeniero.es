import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { StatisticsComponent } from './statistics.component';

const SELECTORS = {
  PLAYERS_IN_FIRST_POSITION: '[data-test-id="players-in-first-position"]',
  PLAYERS_IN_LAST_POSITION: '[data-test-id="players-in-last-position"]',
  PLAYERS_MAXIMUM_SCORE_IN_ONE_ROUND: '[data-test-id="players-maximum-score-in-one-round"]',
  PLAYERS_MINIMUM_SCORE_IN_ONE_ROUND: '[data-test-id="players-minimum-score-in-one-round"]',
  PLAYER_TIME: '[data-test-id="played-time"]',
} as const;

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let gameHolderService: GameHolderService;

  describe('Pocha game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StatisticsComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [10, 20, -10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [5, -10, 5], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [5, 5, -10], punctuation: 0 },
      ];
      localStorage.setItem(LOCAL_STORE_KEYS.TIME_GAME_STARTS, JSON.stringify(Date.now()));
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;
    });

    it('should show message when game has no started', () => {
      gameHolderService.service.players = [{ id: 0, name: 'Player 1', scores: [], punctuation: 0 }];
      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar las estadísticas');
    });

    it('should show players in first position', () => {
      const playersInFirstPosition = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_IN_FIRST_POSITION)).nativeElement;
      expect(playersInFirstPosition.textContent).toEqual('Player 1');
    });

    it('should show players in last position', () => {
      const playersInLastPosition = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_IN_LAST_POSITION)).nativeElement;
      expect(playersInLastPosition.textContent).toEqual('Player 2 y Player 3');
    });

    it('should show maximum score in one round', () => {
      const maximumScoreInOneRound = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_MAXIMUM_SCORE_IN_ONE_ROUND)).nativeElement;
      expect(maximumScoreInOneRound.textContent).toContain('20 por Player 1');
    });

    it('should show minimum score in one round', () => {
      const minimumScoreInOneRound = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_MINIMUM_SCORE_IN_ONE_ROUND)).nativeElement;
      expect(minimumScoreInOneRound.textContent).toContain('-10 por Player 1, Player 2 y Player 3');
    });

    it('should show played time', () => {
      const playedTime = fixture.debugElement.query(By.css(SELECTORS.PLAYER_TIME)).nativeElement;
      expect(playedTime.textContent).toContain('Menos de un minuto');
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StatisticsComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(ChinchonService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [12, 23, 56], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [2, 4, 42], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [42, 12, 2], punctuation: 0 },
      ];
      localStorage.setItem(LOCAL_STORE_KEYS.TIME_GAME_STARTS, JSON.stringify(Date.now() - 420000));
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;
    });

    it('should show message when game has no started', () => {
      gameHolderService.service.players = [{ id: 0, name: 'Player 1', scores: [], punctuation: 0 }];
      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar las estadísticas');
    });

    it('should show players in first position', () => {
      const playersInFirstPosition = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_IN_FIRST_POSITION)).nativeElement;
      expect(playersInFirstPosition.textContent).toEqual('Player 2');
    });

    it('should show players in last position', () => {
      const playersInLastPosition = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_IN_LAST_POSITION)).nativeElement;
      expect(playersInLastPosition.textContent).toEqual('Player 1');
    });

    it('should show maximum score in one round', () => {
      const maximumScoreInOneRound = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_MAXIMUM_SCORE_IN_ONE_ROUND)).nativeElement;
      expect(maximumScoreInOneRound.textContent).toContain('56 por Player 1');
    });

    it('should show minimum score in one round', () => {
      const minimumScoreInOneRound = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_MINIMUM_SCORE_IN_ONE_ROUND)).nativeElement;
      expect(minimumScoreInOneRound.textContent).toContain('2 por Player 2 y Player 3');
    });

    it('should show played time', () => {
      const playedTime = fixture.debugElement.query(By.css(SELECTORS.PLAYER_TIME)).nativeElement;
      expect(playedTime.textContent).toContain('7 minutos');
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StatisticsComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(OtherGameService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [12, 23, 56], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [2, 4, 42], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [42, 12, 2], punctuation: 0 },
      ];
      localStorage.setItem(LOCAL_STORE_KEYS.TIME_GAME_STARTS, JSON.stringify(Date.now() - 3660000));
      fixture = TestBed.createComponent(StatisticsComponent);
      component = fixture.componentInstance;
    });

    it('should show message when game has no started', () => {
      gameHolderService.service.players = [{ id: 0, name: 'Player 1', scores: [], punctuation: 0 }];
      fixture.detectChanges();

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar las estadísticas');
    });

    it('should show players in first position', () => {
      const playersInFirstPosition = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_IN_FIRST_POSITION)).nativeElement;
      expect(playersInFirstPosition.textContent).toEqual('Player 1');
    });

    it('should show players in last position', () => {
      const playersInLastPosition = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_IN_LAST_POSITION)).nativeElement;
      expect(playersInLastPosition.textContent).toEqual('Player 2');
    });

    it('should show maximum score in one round', () => {
      const maximumScoreInOneRound = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_MAXIMUM_SCORE_IN_ONE_ROUND)).nativeElement;
      expect(maximumScoreInOneRound.textContent).toContain('56 por Player 1');
    });

    it('should show minimum score in one round', () => {
      const minimumScoreInOneRound = fixture.debugElement.query(By.css(SELECTORS.PLAYERS_MINIMUM_SCORE_IN_ONE_ROUND)).nativeElement;
      expect(minimumScoreInOneRound.textContent).toContain('2 por Player 2 y Player 3');
    });

    it('should show played time', () => {
      const playedTime = fixture.debugElement.query(By.css(SELECTORS.PLAYER_TIME)).nativeElement;
      expect(playedTime.textContent).toContain('1 hora y 1 minuto');
    });
  });
});
