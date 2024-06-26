import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { ROUTING_PATHS } from '../../../constants/routes';
import { ChinchonService } from '../../../game-services/chinchon.service';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { OtherGameService } from '../../../game-services/other-game.service';
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
  let gameService: any; // * allow to set private variables in services

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
      gameService = TestBed.inject(GameHolderService).service;
    });

    it('should show the position number and medal with proper css class', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [-10, -10],
        [5, 5],
        [10, 5],
        [5, -10],
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

    it('should show the player name and total score', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [-10, -10],
        [5, 5],
        [10, 5],
        [5, -10],
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_AND_TOTAL_SCORE)).nativeElement.innerText).toContain('Player 4\n-5');
    });

    it('should show the last round score and navigate to enter score pocha when clicking the number', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [5, 10],
        [10, -10],
        [-10, 5],
        [5, 5],
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.LAST_ROUND_SCORE)).nativeElement.innerText).toContain('Última ronda: 10');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.LAST_ROUND_SCORE)).nativeElement.innerText).toContain('Última ronda: -10');

      fixture.componentInstance.playerId = 2;
      fixture.detectChanges();
      fixture.debugElement.query(By.css(`${SELECTORS.LAST_ROUND_SCORE} strong`)).nativeElement.click();
      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE_POCHA],
        jasmine.objectContaining({
          state: {
            playerNames: ['Player 3'],
            punctuations: [5],
            roundNumber: 2,
          },
        })
      );
    });

    it('should show maximum reached score', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [5, 10],
        [10, -10],
        [-10, 5],
        [5, -10],
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.MAXIMUM_REACHED_SCORE)).nativeElement.innerText).toContain('Máximo alcanzado: 15');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.MAXIMUM_REACHED_SCORE)).nativeElement.innerText).toContain('Máximo alcanzado: 10');
    });

    it('should not show number of rejoins', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[5, 10]];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_REJOINS))).toBeNull();
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PlayerDisplayComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(ChinchonService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
    });

    it('should show the position number and medal with proper css class', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [[2], [15], [7], [15]];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('1\n🥇');
      expect(fixture.nativeElement).toHaveClass('position-1');

      fixture.componentInstance.playerId = 2;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('2\n🥈');
      expect(fixture.nativeElement).toHaveClass('position-2');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('3\n🥉');
      expect(fixture.nativeElement).toHaveClass('position-3');

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('3\n🥉');
      expect(fixture.nativeElement).toHaveClass('position-3');
    });

    it('should show the player name and total score', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [1, 1, 1],
        [2, 1, 10],
        [3, 6, 1],
        [12, 8, 2],
      ];
      gameService.limitScore = 10;
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_AND_TOTAL_SCORE)).nativeElement.innerText).toContain('Player 1\n3');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_AND_TOTAL_SCORE)).nativeElement.innerText).toContain('Player 2\n10');
    });

    it('should show the last round score and navigate to enter score when clicking the number', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [1, 1, 1],
        [2, 1, 10],
        [3, 6, 1],
        [12, 8, 2],
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.LAST_ROUND_SCORE)).nativeElement.innerText).toContain('Última ronda: 10');

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      fixture.debugElement.query(By.css(`${SELECTORS.LAST_ROUND_SCORE} strong`)).nativeElement.click();
      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE],
        jasmine.objectContaining({
          state: {
            playerNames: ['Player 4'],
            punctuations: [2],
            roundNumber: 3,
          },
        })
      );
    });

    it('should not show maximum reached score', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[5, 10]];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.MAXIMUM_REACHED_SCORE))).toBeNull();
    });

    it('should show the number of rejoins', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [1, 1, 1],
        [2, 1, 10],
        [3, 6, 1],
        [12, 8, 2],
      ];
      gameService.limitScore = 10;
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_REJOINS)).nativeElement.innerText).toContain('Reenganches: 0');

      fixture.componentInstance.playerId = 2;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_REJOINS)).nativeElement.innerText).toContain('Reenganches: 0');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_REJOINS)).nativeElement.innerText).toContain('Reenganches: 1');

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_REJOINS)).nativeElement.innerText).toContain('Reenganches: 3');
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PlayerDisplayComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(OtherGameService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
    });

    it('should show the position number and medal with proper css class', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [
        [15, 8, 9, 12],
        [2, 19, 3, 8],
        [2, 15, 10, 8],
        [2, 10, 5, 14],
      ];
      gameService.winner = 'lowestScore';
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 3;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('1\n🥇');
      expect(fixture.nativeElement).toHaveClass('position-1');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('2\n🥈');
      expect(fixture.nativeElement).toHaveClass('position-2');

      fixture.componentInstance.playerId = 2;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('3\n🥉');
      expect(fixture.nativeElement).toHaveClass('position-3');

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.POSITION)).nativeElement.innerText).toContain('4');
      expect(fixture.nativeElement).toHaveClass('position-4');
    });

    it('should show the player name and total score', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[12, 5, 8]];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.PLAYER_NAME_AND_TOTAL_SCORE)).nativeElement.innerText).toContain('Player 1\n25');
    });

    it('should show the last round score and navigate to enter score when clicking the number', () => {
      const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
      gameService.playerNames = ['Player 1', 'Player 2'];
      gameService.scores = [
        [23, 14, 86],
        [35, 76, 41],
      ];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.LAST_ROUND_SCORE)).nativeElement.innerText).toContain('Última ronda: 86');

      fixture.componentInstance.playerId = 1;
      fixture.detectChanges();
      fixture.debugElement.query(By.css(`${SELECTORS.LAST_ROUND_SCORE} strong`)).nativeElement.click();
      expect(navigateSpy).toHaveBeenCalledWith(
        ['../', ROUTING_PATHS.ENTER_SCORE],
        jasmine.objectContaining({
          state: {
            playerNames: ['Player 2'],
            punctuations: [41],
            roundNumber: 3,
          },
        })
      );
    });

    it('should not show maximum reached score', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[5, 10]];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.MAXIMUM_REACHED_SCORE))).toBeNull();
    });

    it('should not show number of rejoins', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[5, 10]];
      fixture = TestBed.createComponent(PlayerDisplayComponent);

      fixture.componentInstance.playerId = 0;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(SELECTORS.NUMBER_OF_REJOINS))).toBeNull();
    });
  });
});
