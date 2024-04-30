import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { ROUTING_PATHS } from '../../constants/routes';
import { BriscaService } from '../../game-services/brisca.service';
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
        provideGameService(BriscaService),
        provideGameService(OtherGameService),
      ],
    });
    gameHolderService = TestBed.inject(GameHolderService);
    navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
  });

  describe('Pocha game', () => {
    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME, 'Pocha');
      localStorage.setItem(
        LOCAL_STORE_KEYS.SETTINGS('Pocha'),
        JSON.stringify({
          numberOfCards: 36,
          dealingPlayerIndex: 1,
          playerNames: ['Player 1', 'Player 2', 'Player 3'],
          scores: [
            [5, -10],
            [-10, 5],
            [5, 10],
          ],
        })
      );

      fixture = TestBed.createComponent(ResumeGameComponent);
      component = fixture.componentInstance;
    });

    it('should show the game name', () => {
      expect(fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement.textContent).toContain(
        'Parece que hay una partida  de pocha en marcha.'
      );
    });

    it('should allow to cancel the current game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_DO_NOT_RESUME_GAME)).nativeElement.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.objectContaining({}));
    });

    it('should allow to resume the game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_RESUME_GAME)).nativeElement.click();

      const gameService = gameHolderService.service as any; // * allow to set private variables in services
      expect(gameService.gameName).toBe('Pocha');
      expect(gameService.numberOfCards).toEqual(36);
      expect(gameService.dealingPlayerIndex).toEqual(1);
      expect(gameService.playerNames).toEqual(['Player 1', 'Player 2', 'Player 3']);
      expect(gameService.scores).toEqual([
        [5, -10],
        [-10, 5],
        [5, 10],
      ]);

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.RANKING], jasmine.objectContaining({}));
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME, 'Chinchón');
      localStorage.setItem(
        LOCAL_STORE_KEYS.SETTINGS('Chinchón'),
        JSON.stringify({
          limitScore: 102,
          dealingPlayerIndex: 2,
          playerNames: ['Player 1', 'Player 2', 'Player 3'],
          scores: [
            [4, 23],
            [12, 23],
            [28, 3],
          ],
        })
      );

      fixture = TestBed.createComponent(ResumeGameComponent);
      component = fixture.componentInstance;
    });

    it('should show the game name', () => {
      expect(fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement.textContent).toContain(
        'Parece que hay una partida  de chinchón en marcha.'
      );
    });

    it('should allow to cancel the current game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_DO_NOT_RESUME_GAME)).nativeElement.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.objectContaining({}));
    });

    it('should allow to resume the game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_RESUME_GAME)).nativeElement.click();

      const gameService = gameHolderService.service as any; // * allow to set private variables in services
      expect(gameService.gameName).toBe('Chinchón');
      expect(gameService.limitScore).toEqual(102);
      expect(gameService.dealingPlayerIndex).toEqual(2);
      expect(gameService.playerNames).toEqual(['Player 1', 'Player 2', 'Player 3']);
      expect(gameService.scores).toEqual([
        [4, 23],
        [12, 23],
        [28, 3],
      ]);

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.SCOREBOARD], jasmine.objectContaining({}));
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME, 'Otro juego');
      localStorage.setItem(
        LOCAL_STORE_KEYS.SETTINGS('Otro juego'),
        JSON.stringify({
          winner: 'lowestScore',
          dealingPlayerIndex: 0,
          playerNames: ['Player 1', 'Player 2', 'Player 3'],
          scores: [
            [4, 23],
            [12, 23],
            [28, 3],
          ],
        })
      );

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

      const gameService = gameHolderService.service as any; // * allow to set private variables in services
      expect(gameService.gameName).toBe('Otro juego');
      expect(gameService.winner).toEqual('lowestScore');
      expect(gameService.dealingPlayerIndex).toEqual(0);
      expect(gameService.playerNames).toEqual(['Player 1', 'Player 2', 'Player 3']);
      expect(gameService.scores).toEqual([
        [4, 23],
        [12, 23],
        [28, 3],
      ]);

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.RANKING], jasmine.objectContaining({}));
    });
  });

  describe('Brisca game', () => {
    beforeEach(() => {
      localStorage.setItem(LOCAL_STORE_KEYS.SAVED_GAME_NAME, 'Brisca');
      localStorage.setItem(
        LOCAL_STORE_KEYS.SETTINGS('Brisca'),
        JSON.stringify({
          modality: 'teams',
          scores: [4, 6],
          teamNames: ['Us', 'Them'],
          playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'],
          dealingPlayerIndex: 0,
        })
      );

      fixture = TestBed.createComponent(ResumeGameComponent);
      component = fixture.componentInstance;
    });

    it('should not show the game name', () => {
      expect(fixture.debugElement.query(By.css(SELECTORS.GAME_NAME)).nativeElement.textContent).toContain(
        'Parece que hay una partida  de brisca en marcha.'
      );
    });

    it('should allow to cancel the current game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_DO_NOT_RESUME_GAME)).nativeElement.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.objectContaining({}));
    });

    it('should allow to resume the game', () => {
      fixture.debugElement.query(By.css(SELECTORS.BTN_RESUME_GAME)).nativeElement.click();

      const gameService = gameHolderService.service as any; // * allow to set private variables in services
      expect(gameService.gameName).toBe('Brisca');
      expect(gameService.modality).toEqual('teams');
      expect(gameService.scores).toEqual([4, 6]);
      expect(gameService.teamNames).toEqual(['Us', 'Them']);
      expect(gameService.playerNames).toEqual(['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6']);
      expect(gameService.dealingPlayerIndex).toEqual(0);

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.BRISCA], jasmine.objectContaining({}));
    });
  });
});
