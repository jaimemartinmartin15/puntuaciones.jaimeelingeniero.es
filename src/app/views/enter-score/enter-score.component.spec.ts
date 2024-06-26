import { Location } from '@angular/common';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Navigation, Router, provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { EnterScoreComponent } from './enter-score.component';

const SELECTORS = {
  CLOSE_BUTTON: '[data-test-id="close-button"]',
  ROUND_NUMBER: '[data-test-id="round-number"]',
  PLAYER_NAME: '[data-test-id="player-name"]',
  PLAYER_PUNCTUATION: '[data-test-id="player-punctuation"]',
  KB_BTN_PREV: '[data-test-id="kb-btn-prev"]',
  KB_BTN_NEXT: '[data-test-id="kb-btn-next"]',
  KB_BTN_0: '[data-test-id="kb-btn-0"]',
  KB_BTN_1: '[data-test-id="kb-btn-1"]',
  KB_BTN_2: '[data-test-id="kb-btn-2"]',
  KB_BTN_3: '[data-test-id="kb-btn-3"]',
  KB_BTN_4: '[data-test-id="kb-btn-4"]',
  KB_BTN_5: '[data-test-id="kb-btn-5"]',
  KB_BTN_6: '[data-test-id="kb-btn-6"]',
  KB_BTN_7: '[data-test-id="kb-btn-7"]',
  KB_BTN_8: '[data-test-id="kb-btn-8"]',
  KB_BTN_9: '[data-test-id="kb-btn-9"]',
  KB_BTN_SIGN: '[data-test-id="kb-btn-sign"]',
  KB_BTN_DELETE: '[data-test-id="kb-btn-delete"]',
} as const;

describe('EnterScoreComponent', () => {
  let locationBackSpy: jasmine.Spy;
  let fixture: ComponentFixture<EnterScoreComponent>;
  let gameService: any; // * allow to set private variables in services

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Entering a new round', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnterScoreComponent],
        providers: [
          provideNoopAnimations(),
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(OtherGameService),
        ],
      });

      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
      gameService.scores = [
        [1, 50, 3],
        [2, 30, 42],
        [10, 2, 34],
      ];

      spyOn(TestBed.inject(Router), 'getCurrentNavigation').and.returnValue({
        extras: {
          state: gameService.getStateEnterNewRound(),
        },
      } as unknown as Navigation);

      locationBackSpy = spyOn(TestBed.inject(Location), 'back');

      fixture = TestBed.createComponent(EnterScoreComponent);
      fixture.detectChanges();
    });

    it('should allow to enter score for all players', () => {
      const prevButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_PREV)).nativeElement;
      const nextButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_NEXT)).nativeElement;
      let playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      let playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      const dealingPlayerIndex = gameService.dealingPlayerIndex;

      expect(fixture.debugElement.query(By.css(SELECTORS.ROUND_NUMBER)).nativeElement.textContent).toEqual('Ronda 4');

      expect(prevButton.disabled).toBeTrue();
      expect(playerName.textContent).toContain('Player 1');
      expect(playerPunctuation.textContent).toContain('0');

      nextButton.click();
      expect(prevButton.disabled).toBeFalse();
      expect(nextButton.textContent).toContain('→');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 2');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('0');

      nextButton.click();
      expect(nextButton.textContent).toContain('✔️');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 3');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('0');
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_3)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_6)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('36');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_SIGN)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('-36');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_DELETE)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('-3');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_DELETE)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('0');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_7)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('7');

      nextButton.click();
      expect(locationBackSpy).toHaveBeenCalled();
      expect(dealingPlayerIndex + 1).toBe(gameService.dealingPlayerIndex);
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS('Otro juego'))).not.toBeNull();
    });
  });

  describe('Changing scores of a previous round', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnterScoreComponent],
        providers: [
          provideNoopAnimations(),
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });

      spyOn(TestBed.inject(Router), 'getCurrentNavigation').and.returnValue({
        extras: {
          state: {
            playerNames: ['Player 1', 'Player 2', 'Player 3'],
            punctuations: [50, 30, 2],
            roundNumber: 2,
          },
        },
      } as unknown as Navigation);

      locationBackSpy = spyOn(TestBed.inject(Location), 'back');

      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
      gameService.scores = [
        [1, 50, 3],
        [2, 30, 42],
        [10, 2, 34],
      ];

      fixture = TestBed.createComponent(EnterScoreComponent);
      fixture.detectChanges();
    });

    it('should allow to change score for all players', () => {
      const prevButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_PREV)).nativeElement;
      const nextButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_NEXT)).nativeElement;
      let playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      let playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      const dealingPlayerIndex = gameService.dealingPlayerIndex;

      expect(fixture.debugElement.query(By.css(SELECTORS.ROUND_NUMBER)).nativeElement.textContent).toEqual('Ronda 2');

      expect(prevButton.disabled).toBeTrue();
      expect(playerName.textContent).toContain('Player 1');
      expect(playerPunctuation.textContent).toContain('50');

      nextButton.click();
      expect(prevButton.disabled).toBeFalse();
      expect(nextButton.textContent).toContain('→');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 2');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('30');

      nextButton.click();
      expect(nextButton.textContent).toContain('✔️');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 3');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('2');

      nextButton.click();
      expect(locationBackSpy).toHaveBeenCalled();

      expect(gameService.scores[2][1]).toBe(2);
      expect(dealingPlayerIndex).toBe(gameService.dealingPlayerIndex);
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS('Pocha'))).not.toBeNull();
    });
  });

  describe('Changing score for one player', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnterScoreComponent],
        providers: [
          provideNoopAnimations(),
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });

      spyOn(TestBed.inject(Router), 'getCurrentNavigation').and.returnValue({
        extras: {
          state: {
            playerNames: ['Player 2'],
            punctuations: [2],
            roundNumber: 1,
          },
        },
      } as unknown as Navigation);

      locationBackSpy = spyOn(TestBed.inject(Location), 'back');

      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
      gameService.scores = [
        [1, 50, 3],
        [2, 30, 42],
        [10, 2, 34],
      ];

      fixture = TestBed.createComponent(EnterScoreComponent);
      fixture.detectChanges();
    });

    it('should allow to change the score', () => {
      const nextButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_NEXT)).nativeElement;
      let playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      let playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      const dealingPlayerIndex = gameService.dealingPlayerIndex;

      expect(playerName.textContent).toContain('Player 2');
      expect(playerPunctuation.textContent).toContain('2');
      expect(gameService.scores[1][0]).toBe(2);

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_6)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_SIGN)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('-26');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_DELETE)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_DELETE)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_8)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_4)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('84');

      nextButton.click();
      expect(locationBackSpy).toHaveBeenCalled();

      expect(gameService.scores[1][0]).toBe(84);
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS('Pocha'))).not.toBeNull();
      expect(dealingPlayerIndex).toBe(gameService.dealingPlayerIndex);
    });

    it('should allow to cancel without saving changes', () => {
      fixture.debugElement.query(By.css(SELECTORS.CLOSE_BUTTON)).nativeElement.click();
      expect(locationBackSpy).toHaveBeenCalled();
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS('Pocha'))).toBeNull();
    });
  });
});
