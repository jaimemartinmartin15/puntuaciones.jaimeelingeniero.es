import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { PochaService } from '../../../game-services/pocha.service';
import { provideGameService } from '../../../game-services/utils';
import { PlayerDisplayComponent } from './player-display.component';

const SELECTORS = {
  POSITION: '[data-test-id="position"]',
  PLAYER_NAME_AND_TOTAL_SCORE: '[data-test-id="player-name-and-total-score"]',
  LAST_ROUND_SCORE: '[data-test-id="score-last-round"]',
  MAXIMUM_REACHED_SCORE: '[data-test-id="maximum-reached-score"]',
  NUMBER_OF_REJOINS: '[data-test-id="number-of-rejoins"]',
} as const;

describe('PlayerDisplayComponent', () => {
  let fixture: ComponentFixture<PlayerDisplayComponent>;
  let gameHolderService: GameHolderService;

  describe('Pocha game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PlayerDisplayComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });
      gameHolderService = TestBed.inject(GameHolderService);
    });

    it('should show the position number and medal with proper css class', () => {
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [-10, -10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [5, 5], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [10, 5], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [5, -10], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 2;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('1\n🥇');
      expect(fixture.nativeElement).toHaveClass('position-1');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('2\n🥈');
      expect(fixture.nativeElement).toHaveClass('position-2');

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('3\n🥉');
      expect(fixture.nativeElement).toHaveClass('position-3');

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('4');
      expect(fixture.nativeElement).toHaveClass('position-4');
    });

    it('should show the last round score', () => {
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [5, 10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [10, -10], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [-10, 5], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [5, 5], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.LAST_ROUND_SCORE)).nativeElement.innerText).toContain('Última ronda: 10');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.LAST_ROUND_SCORE)).nativeElement.innerText).toContain('Última ronda: -10');
    });

    it('should show maximum reached score', () => {
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [5, 10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [10, -10], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [-10, 5], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [5, -10], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.MAXIMUM_REACHED_SCORE)).nativeElement.innerText).toContain('Máximo alcanzado: 15');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.MAXIMUM_REACHED_SCORE)).nativeElement.innerText).toContain('Máximo alcanzado: 10');
    });

    it('should show the player name and total score', () => {
      gameHolderService.service.players = [
        { id: 0, name: 'Player 1', scores: [-10, -10], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [5, 5], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [10, 5], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [5, -10], punctuation: 0 },
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_AND_TOTAL_SCORE)).nativeElement.innerText).toContain('Player 4\n-5');
    });
  });
});
