import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { ROUTING_PATHS } from '../../constants/routes';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { ResumeGameComponent } from './resume-game.component';

const SELECTORS = {
  GAME_NAME: '[data-test-id="game-name"]',
  BTN_DO_NOT_RESUME_GAME: '[data-test-id="btn-do-not-resume-game"]',
  BTN_RESUME_GAME: '[data-test-id="btn-resume-game"]',
} as const;

describe('ResumeGameComponent', () => {
  let component: ResumeGameComponent;
  let fixture: ComponentFixture<ResumeGameComponent>;
  let gameHolderService: GameHolderService;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResumeGameComponent],
      providers: [
        provideRouter([]),
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: GameHolderService, useClass: GameHolderService },
        provideGameService(PochaService),
        provideGameService(ChinchonService),
        provideGameService(OtherGameService),
      ],
    });
    gameHolderService = TestBed.inject(GameHolderService);
    navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
  });

  describe('Pocha game', () => {
    const players = [
      { id: 0, name: 'Player 1', scores: [5, -10], punctuation: 0 },
      { id: 1, name: 'Player 2', scores: [-10, 5], punctuation: 0 },
      { id: 2, name: 'Player 3', scores: [5, 10], punctuation: 0 },
    ];

    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.GAME_NAME, 'Pocha');
      localStorage.setItem(LOCAL_STORE_KEYS.PLAYERS, JSON.stringify(players));
      localStorage.setItem(LOCAL_STORE_KEYS.DEALING_PLAYER_INDEX, '1');
      localStorage.setItem(LOCAL_STORE_KEYS.CONFIG, JSON.stringify({ numberOfCards: 36 }));

      fixture = TestBed.createComponent(ResumeGameComponent);
      component = fixture.componentInstance;
    });

    it('should show the game name', () => {
      expect(fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement.textContent).toContain(
        'Parece que hay una partida de pocha en marcha.'
      );
    });

    it('should allow to cancel the current game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_DO_NOT_RESUME_GAME)).nativeElement.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.objectContaining({}));
    });

    it('should allow to resume the game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_RESUME_GAME)).nativeElement.click();

      expect(gameHolderService.service.gameName).toBe('Pocha');
      expect(gameHolderService.service.players).toEqual(players);
      expect(gameHolderService.service.dealingPlayerIndex).toEqual(1);
      expect(gameHolderService.service.numberOfCards).toEqual(36);

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.RANKING], jasmine.objectContaining({}));
    });
  });

  describe('Chinchón game', () => {
    const players = [
      { id: 0, name: 'Player 1', scores: [4, 23], punctuation: 0 },
      { id: 1, name: 'Player 2', scores: [12, 23], punctuation: 0 },
      { id: 2, name: 'Player 3', scores: [28, 3], punctuation: 0 },
    ];

    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.GAME_NAME, 'Chinchón');
      localStorage.setItem(LOCAL_STORE_KEYS.PLAYERS, JSON.stringify(players));
      localStorage.setItem(LOCAL_STORE_KEYS.DEALING_PLAYER_INDEX, '2');
      localStorage.setItem(LOCAL_STORE_KEYS.CONFIG, JSON.stringify({ limitScore: 102 }));

      fixture = TestBed.createComponent(ResumeGameComponent);
      component = fixture.componentInstance;
    });

    it('should show the game name', () => {
      expect(fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement.textContent).toContain(
        'Parece que hay una partida de chinchón en marcha.'
      );
    });

    it('should allow to cancel the current game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_DO_NOT_RESUME_GAME)).nativeElement.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.objectContaining({}));
    });

    it('should allow to resume the game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_RESUME_GAME)).nativeElement.click();

      expect(gameHolderService.service.gameName).toBe('Chinchón');
      expect(gameHolderService.service.players).toEqual(players);
      expect(gameHolderService.service.dealingPlayerIndex).toEqual(2);
      expect(gameHolderService.service.limitScore).toEqual(102);

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.RANKING], jasmine.objectContaining({}));
    });
  });

  describe('Other game', () => {
    const players = [
      { id: 0, name: 'Player 1', scores: [4, 23], punctuation: 0 },
      { id: 1, name: 'Player 2', scores: [12, 23], punctuation: 0 },
      { id: 2, name: 'Player 3', scores: [28, 3], punctuation: 0 },
    ];

    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.GAME_NAME, 'Otro juego');
      localStorage.setItem(LOCAL_STORE_KEYS.PLAYERS, JSON.stringify(players));
      localStorage.setItem(LOCAL_STORE_KEYS.DEALING_PLAYER_INDEX, '0');
      localStorage.setItem(LOCAL_STORE_KEYS.CONFIG, JSON.stringify({ winner: 'lowestScore' }));

      fixture = TestBed.createComponent(ResumeGameComponent);
      component = fixture.componentInstance;
    });

    it('should not show the game name', () => {
      expect(fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement.textContent).toContain('Parece que hay una partida  en marcha.');
    });

    it('should allow to cancel the current game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_DO_NOT_RESUME_GAME)).nativeElement.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.objectContaining({}));
    });

    it('should allow to resume the game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_RESUME_GAME)).nativeElement.click();

      expect(gameHolderService.service.gameName).toBe('Otro juego');
      expect(gameHolderService.service.players).toEqual(players);
      expect(gameHolderService.service.dealingPlayerIndex).toEqual(0);
      expect(gameHolderService.service.winner).toEqual('lowestScore');

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.RANKING], jasmine.objectContaining({}));
    });
  });
});
