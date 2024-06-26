import { Location } from '@angular/common';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Navigation, Router, provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { GameHolderService } from '../../game-services/game-holder.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { EnterScorePochaComponent } from './enter-score-pocha.component';

const SELECTORS = {
  CLOSE_BUTTON: '[data-test-id="close-button"]',
  ROUND_NUMBER: '[data-test-id="round-number"]',
  PLAYER_NAME: '[data-test-id="player-name"]',
  PLAYER_PUNCTUATION: '[data-test-id="player-punctuation"]',
  KB_BTN_PREV: '[data-test-id="kb-btn-prev"]',
  KB_BTN_NEXT: '[data-test-id="kb-btn-next"]',
  KB_BTN__10: '[data-test-id="kb-btn--10"]',
  KB_BTN_10: '[data-test-id="kb-btn-10"]',
  KB_BTN_20: '[data-test-id="kb-btn-20"]',
  KB_BTN__20: '[data-test-id="kb-btn--20"]',
  KB_BTN_30: '[data-test-id="kb-btn-30"]',
  KB_BTN_40: '[data-test-id="kb-btn-40"]',
  KB_BTN__30: '[data-test-id="kb-btn--30"]',
  KB_BTN_50: '[data-test-id="kb-btn-50"]',
  KB_BTN_60: '[data-test-id="kb-btn-60"]',
  KB_BTN_SUBTRACT_10: '[data-test-id="kb-btn-subtract-10"]',
  KB_BTN_ADD_10: '[data-test-id="kb-btn-add-10"]',
  KB_BTN_5: '[data-test-id="kb-btn-5"]',
} as const;

describe('EnterScorePochaComponent', () => {
  let locationBackSpy: jasmine.Spy;
  let fixture: ComponentFixture<EnterScorePochaComponent>;
  let gameService: any; // * allow to set private variables in services

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Entering a new round', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnterScorePochaComponent],
        providers: [
          provideNoopAnimations(),
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });

      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
      gameService.scores = [
        [5, 10],
        [5, -10],
        [-10, 10],
      ];

      spyOn(TestBed.inject(Router), 'getCurrentNavigation').and.returnValue({
        extras: {
          state: gameService.getStateEnterNewRound(),
        },
      } as unknown as Navigation);

      locationBackSpy = spyOn(TestBed.inject(Location), 'back');

      fixture = TestBed.createComponent(EnterScorePochaComponent);
      fixture.detectChanges();
    });

    it('should allow to enter score for all players', () => {
      const prevButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_PREV)).nativeElement;
      const nextButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_NEXT)).nativeElement;
      let playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      let playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      const dealingPlayerIndex = gameService.dealingPlayerIndex;

      expect(prevButton.disabled).toBeTrue();
      expect(playerName.textContent).toContain('Player 1');
      expect(playerPunctuation.textContent).toContain('5');

      nextButton.click();
      expect(prevButton.disabled).toBeFalse();
      expect(nextButton.textContent).toContain('→');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 2');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('5');

      nextButton.click();
      expect(nextButton.textContent).toContain('✔️');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 3');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('5');

      // checking validation there is at least a negative value
      nextButton.click();
      expect(locationBackSpy).not.toHaveBeenCalled();

      nextButton.click();
      nextButton.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN__10)).nativeElement.click();
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('-10');

      nextButton.click();
      expect(locationBackSpy).toHaveBeenCalled();
      expect(dealingPlayerIndex + 1).toBe(gameService.dealingPlayerIndex);
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS('Pocha'))).not.toBeNull();
    });
  });

  describe('Changing scores of a previous round', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnterScorePochaComponent],
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
            punctuations: [10, -10, 10],
            roundNumber: 2,
          },
        },
      } as unknown as Navigation);

      locationBackSpy = spyOn(TestBed.inject(Location), 'back');

      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
      gameService.scores = [
        [5, 10],
        [5, -10],
        [-10, 10],
      ];
      fixture = TestBed.createComponent(EnterScorePochaComponent);
      fixture.detectChanges();
    });

    it('should allow to change score for all players', () => {
      const prevButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_PREV)).nativeElement;
      const nextButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_NEXT)).nativeElement;
      let playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      let playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      const dealingPlayerIndex = gameService.dealingPlayerIndex;

      expect(prevButton.disabled).toBeTrue();
      expect(playerName.textContent).toContain('Player 1');
      expect(playerPunctuation.textContent).toContain('10');

      nextButton.click();
      expect(prevButton.disabled).toBeFalse();
      expect(nextButton.textContent).toContain('→');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 2');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('-10');

      nextButton.click();
      expect(nextButton.textContent).toContain('✔️');
      playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      expect(playerName.textContent).toContain('Player 3');
      playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      expect(playerPunctuation.textContent).toContain('10');

      // checking validation not invalid score (15)
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_5)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_ADD_10)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('15');

      nextButton.click();
      expect(locationBackSpy).not.toHaveBeenCalled();

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_5)).nativeElement.click();
      nextButton.click();
      expect(locationBackSpy).toHaveBeenCalled();

      expect(gameService.scores[2][1]).toBe(5);
      expect(dealingPlayerIndex).toBe(gameService.dealingPlayerIndex);
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS('Pocha'))).not.toBeNull();
    });
  });

  describe('Changing score for one player', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnterScorePochaComponent],
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
            punctuations: [-10],
            roundNumber: 1,
          },
        },
      } as unknown as Navigation);

      locationBackSpy = spyOn(TestBed.inject(Location), 'back');

      gameService = TestBed.inject(GameHolderService).service;
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
      gameService.scores = [
        [5, -10],
        [-10, 5],
        [-10, 10],
      ];

      fixture = TestBed.createComponent(EnterScorePochaComponent);
      fixture.detectChanges();
    });

    it('should allow to change the score', () => {
      const nextButton = fixture.debugElement.query(By.css(SELECTORS.KB_BTN_NEXT)).nativeElement;
      let playerName = fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME)).nativeElement;
      let playerPunctuation = fixture.debugElement.query(By.css(SELECTORS.PLAYER_PUNCTUATION)).nativeElement;
      const dealingPlayerIndex = gameService.dealingPlayerIndex;

      expect(playerName.textContent).toContain('Player 2');
      expect(playerPunctuation.textContent).toContain('-10');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_SUBTRACT_10)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('-20');

      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_60)).nativeElement.click();
      fixture.debugElement.query(By.css(SELECTORS.KB_BTN_ADD_10)).nativeElement.click();
      expect(playerPunctuation.textContent).toContain('70');

      nextButton.click();
      expect(locationBackSpy).toHaveBeenCalled();

      expect(gameService.scores[1][1]).toBe(5);
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
