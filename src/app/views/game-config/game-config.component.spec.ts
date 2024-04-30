import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { BriscaService } from '../../game-services/brisca.service';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { GameConfigComponent } from './game-config.component';

const SELECTORS = {
  SELECT_GAME_NAME: '[data-test-id="select-game-name"]',
  GAME_NAME_OPTION: (gameName: string) => `[data-test-id="game-name-option-${gameName}"]`,
  SELECTED_NUMBER_OF_CARDS: '[data-test-id="selected-number-of-cards"]',
  SELECTED_LIMIT_SCORE: '[data-test-id="selected-limit-score"]',
  OPTION_WINNER_HIGHEST_SCORE: '[data-test-id="option-winner-highest-score"]',
  OPTION_WINNER_LOWEST_SCORE: '[data-test-id="option-winner-lowest-score"]',
  OPTION_MODALITY_INDIVIDUAL: '[data-test-id="option-modality-individual"]',
  OPTION_MODALITY_TEAMS: '[data-test-id="option-modality-teams"]',
  BTN_ADD_PLAYER: '[data-test-id="btn-add-player"]',
  PLAYER_INPUT: (playerId: number) => `[data-test-id="player-input-${playerId}"]`,
  DEALING_PLAYER_ICON: (playerId: number) => `[data-test-id="dealing-player-icon-${playerId}"]`,
  BTN_DELET_PLAYER: (playerId: number) => `[data-test-id="btn-delete-player-${playerId}"]`,
  BTN_START: '[data-test-id="btn-start"]',
  BTN_GO_BACK: '[data-test-id="btn-go-back"]',
} as const;

describe('GameConfigComponent', () => {
  let component: GameConfigComponent;
  let fixture: ComponentFixture<GameConfigComponent>;
  let gameService: any; // * allow to set private variables in services
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GameConfigComponent],
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
    localStorage.clear();
    gameService = TestBed.inject(GameHolderService).service;
    fixture = TestBed.createComponent(GameConfigComponent);
    component = fixture.componentInstance;
    navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
  });

  it('should be possible to add, delete and enter player names', () => {
    const startButtonEl = fixture.debugElement.query(By.css(SELECTORS.BTN_START)).nativeElement;
    expect(gameService.teamControls.controls[0].value.playerNames).toEqual(['', '', '', '']);
    expect(startButtonEl.disabled).toBeTrue();

    gameService.teamControls.controls[0].setValue({
      teamName: 'Jugadores',
      playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
      dealingPlayerIndex: 0,
    });
    fixture.detectChanges();

    expect(startButtonEl.disabled).toBeFalse();

    fixture.debugElement.query(By.css(SELECTORS.BTN_DELET_PLAYER(2))).nativeElement.click();
    expect(gameService.teamControls.controls[0].value.playerNames.length).toEqual(3);

    fixture.debugElement.query(By.css(SELECTORS.BTN_ADD_PLAYER)).nativeElement.click();
    fixture.detectChanges();
    expect(startButtonEl.disabled).toBeTrue();

    startButtonEl.click();
    expect(navigateSpy).not.toHaveBeenCalled();

    fixture.debugElement.query(By.css(SELECTORS.BTN_DELET_PLAYER(3))).nativeElement.click();
    fixture.detectChanges();
    startButtonEl.click();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should be possible to select who starts dealing', () => {
    expect(gameService.teamControls.controls[0].value.dealingPlayerIndex).toBe(0);
    fixture.debugElement.query(By.css(SELECTORS.DEALING_PLAYER_ICON(1))).nativeElement.dispatchEvent(new Event('click'));
    expect(gameService.teamControls.controls[0].value.dealingPlayerIndex).toBe(1);
  });

  describe('Pocha game', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css(SELECTORS.SELECT_GAME_NAME)).nativeElement.click();
      fixture.detectChanges();
      fixture.debugElement.query(By.css(SELECTORS.GAME_NAME_OPTION('Pocha'))).nativeElement.click();
      fixture.detectChanges();
    });

    it('should be possible to select pocha game', () => {
      expect(component.selectedGameService.gameName).toBe('Pocha');
    });

    it('should be possible to select the number of cards', () => {
      const numberOfCards = fixture.debugElement.query(By.css(SELECTORS.SELECTED_NUMBER_OF_CARDS)).nativeElement.textContent;
      expect(numberOfCards).not.toBeNull();
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css(SELECTORS.SELECT_GAME_NAME)).nativeElement.click();
      fixture.detectChanges();
      fixture.debugElement.query(By.css(SELECTORS.GAME_NAME_OPTION('Chinchón'))).nativeElement.click();
      fixture.detectChanges();
    });

    it('should be possible to select chinchón game', () => {
      expect(component.selectedGameService.gameName).toBe('Chinchón');
    });

    it('should be possible to select the limit score', () => {
      const limitScore = fixture.debugElement.query(By.css(SELECTORS.SELECTED_LIMIT_SCORE)).nativeElement.textContent;
      expect(limitScore).not.toBeNull();
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css(SELECTORS.SELECT_GAME_NAME)).nativeElement.click();
      fixture.detectChanges();
      fixture.debugElement.query(By.css(SELECTORS.GAME_NAME_OPTION('Otro juego'))).nativeElement.click();
      fixture.detectChanges();
    });

    it('should be possible to select other game', () => {
      expect(component.selectedGameService.gameName).toBe('Otro juego');
    });

    it('should be possible to select the winner', () => {
      const optionWinnerLowestScoreEl = fixture.debugElement.query(By.css(SELECTORS.OPTION_WINNER_LOWEST_SCORE)).nativeElement;
      expect(optionWinnerLowestScoreEl).not.toBeNull();
      const optionWinnerHighestScoreEl = fixture.debugElement.query(By.css(SELECTORS.OPTION_WINNER_HIGHEST_SCORE)).nativeElement;
      expect(optionWinnerHighestScoreEl).not.toBeNull();
    });
  });

  describe('Brisca game', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css(SELECTORS.SELECT_GAME_NAME)).nativeElement.click();
      fixture.detectChanges();
      fixture.debugElement.query(By.css(SELECTORS.GAME_NAME_OPTION('Brisca'))).nativeElement.click();
      fixture.detectChanges();
    });

    it('should be possible to select brisca game', () => {
      expect(component.selectedGameService.gameName).toBe('Brisca');
    });

    it('should be possible to select modality', () => {
      const optionIndividualEl = fixture.debugElement.query(By.css(SELECTORS.OPTION_MODALITY_INDIVIDUAL)).nativeElement;
      expect(optionIndividualEl).not.toBeNull();
      const optionTeamEl = fixture.debugElement.query(By.css(SELECTORS.OPTION_MODALITY_TEAMS)).nativeElement;
      expect(optionTeamEl).not.toBeNull();
    });
  });
});
