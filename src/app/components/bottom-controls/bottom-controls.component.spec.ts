import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { ROUTING_PATHS } from '../../constants/routes';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { BottomControlsComponent } from './bottom-controls.component';

const SELECTORS = {
  BTN_NEW_GAME: '[data-test-id="btn-new-game"]',
  BTN_CHANGE_VIEW: '[data-test-id="btn-change-view"]',
  BTN_NEW_ROUND: '[data-test-id="btn-new-round"]',
  CHANGE_VIEW_POP_UP: '[data-test-id="change-view-pop-up"]',
} as const;

describe('BottomControlsComponent', () => {
  let fixture: ComponentFixture<BottomControlsComponent>;
  let gameHolderService: GameHolderService;
  let btnNewGame: HTMLButtonElement;
  let btnChangeView: HTMLButtonElement;
  let btnNewRound: HTMLButtonElement;

  describe('Pocha game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BottomControlsComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      fixture = TestBed.createComponent(BottomControlsComponent);

      btnNewGame = fixture.debugElement.query(By.css(SELECTORS.BTN_NEW_GAME)).nativeElement;
      btnChangeView = fixture.debugElement.query(By.css(SELECTORS.BTN_CHANGE_VIEW)).nativeElement;
      btnNewRound = fixture.debugElement.query(By.css(SELECTORS.BTN_NEW_ROUND)).nativeElement;
    });

    it('should show buttons: new game, change view, new round', () => {
      expect(btnNewGame).toBeDefined();
      expect(btnChangeView).toBeDefined();
      expect(btnNewRound).toBeDefined();
    });

    it('should navigate to game config when clicking on new game', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      btnNewGame.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.any(Object));
    });

    it('should open change view pop up with links: ranking, scoreboard, statistics', () => {
      let changeViewPopUp = fixture.debugElement.query(By.css(SELECTORS.CHANGE_VIEW_POP_UP));
      expect(changeViewPopUp).toBeNull();

      btnChangeView.click();
      changeViewPopUp = fixture.debugElement.query(By.css(SELECTORS.CHANGE_VIEW_POP_UP));
      expect(changeViewPopUp.nativeElement).toBeDefined();

      const viewLinks = changeViewPopUp.queryAll(By.css('a'));
      expect(viewLinks.length).toBe(3);
      expect(viewLinks[0].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.RANKING}`);
      expect(viewLinks[1].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.SCOREBOARD}`);
      expect(viewLinks[2].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.STATISTICS}`);
    });

    it('should navigate to enter score pocha when clicking on new round button', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
      ];
      btnNewRound.click();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE_POCHA],
        jasmine.objectContaining({
          state: {
            players: [
              { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
              { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
            ],
            roundNumber: 1,
          },
        })
      );
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BottomControlsComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(ChinchonService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      fixture = TestBed.createComponent(BottomControlsComponent);

      btnNewGame = fixture.debugElement.query(By.css(SELECTORS.BTN_NEW_GAME)).nativeElement;
      btnChangeView = fixture.debugElement.query(By.css(SELECTORS.BTN_CHANGE_VIEW)).nativeElement;
      btnNewRound = fixture.debugElement.query(By.css(SELECTORS.BTN_NEW_ROUND)).nativeElement;
    });

    it('should show buttons: new game, change view, new round', () => {
      expect(btnNewGame).toBeDefined();
      expect(btnChangeView).toBeDefined();
      expect(btnNewRound).toBeDefined();
    });

    it('should navigate to game config when clicking on new game', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      btnNewGame.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.any(Object));
    });

    it('should open change view pop up with links: ranking, scoreboard, statistics', () => {
      let changeViewPopUp = fixture.debugElement.query(By.css(SELECTORS.CHANGE_VIEW_POP_UP));
      expect(changeViewPopUp).toBeNull();

      btnChangeView.click();
      changeViewPopUp = fixture.debugElement.query(By.css(SELECTORS.CHANGE_VIEW_POP_UP));
      expect(changeViewPopUp.nativeElement).toBeDefined();

      const viewLinks = changeViewPopUp.queryAll(By.css('a'));
      expect(viewLinks.length).toBe(3);
      expect(viewLinks[0].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.RANKING}`);
      expect(viewLinks[1].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.SCOREBOARD}`);
      expect(viewLinks[2].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.STATISTICS}`);
    });

    it('should navigate to enter score when clicking on new round button', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
      ];
      btnNewRound.click();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE],
        jasmine.objectContaining({
          state: {
            players: [
              { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
              { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
            ],
            roundNumber: 1,
          },
        })
      );
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [BottomControlsComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(OtherGameService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
      fixture = TestBed.createComponent(BottomControlsComponent);

      btnNewGame = fixture.debugElement.query(By.css(SELECTORS.BTN_NEW_GAME)).nativeElement;
      btnChangeView = fixture.debugElement.query(By.css(SELECTORS.BTN_CHANGE_VIEW)).nativeElement;
      btnNewRound = fixture.debugElement.query(By.css(SELECTORS.BTN_NEW_ROUND)).nativeElement;
    });

    it('should show buttons: new game, change view, new round', () => {
      expect(btnNewGame).toBeDefined();
      expect(btnChangeView).toBeDefined();
      expect(btnNewRound).toBeDefined();
    });

    it('should navigate to game config when clicking on new game', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      btnNewGame.click();

      expect(navigateSpy).toHaveBeenCalledWith(['../', ROUTING_PATHS.GAME_CONFIG], jasmine.any(Object));
    });

    it('should open change view pop up with links: ranking, scoreboard, statistics', () => {
      let changeViewPopUp = fixture.debugElement.query(By.css(SELECTORS.CHANGE_VIEW_POP_UP));
      expect(changeViewPopUp).toBeNull();

      btnChangeView.click();
      changeViewPopUp = fixture.debugElement.query(By.css(SELECTORS.CHANGE_VIEW_POP_UP));
      expect(changeViewPopUp.nativeElement).toBeDefined();

      const viewLinks = changeViewPopUp.queryAll(By.css('a'));
      expect(viewLinks.length).toBe(3);
      expect(viewLinks[0].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.RANKING}`);
      expect(viewLinks[1].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.SCOREBOARD}`);
      expect(viewLinks[2].nativeElement.getAttribute('href')).toBe(`/${ROUTING_PATHS.STATISTICS}`);
    });

    it('should navigate to enter score when clicking on new round button', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
      ];
      btnNewRound.click();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE],
        jasmine.objectContaining({
          state: {
            players: [
              { id: 0, name: 'Player 1', scores: [], punctuation: 0 },
              { id: 1, name: 'Player 2', scores: [], punctuation: 0 },
            ],
            roundNumber: 1,
          },
        })
      );
    });
  });
});
