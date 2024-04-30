import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ChinchonService } from '../../game-services/chinchon.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { OtherGameService } from '../../game-services/other-game.service';
import { PochaService } from '../../game-services/pocha.service';
import { provideGameService } from '../../game-services/utils';
import { RankingComponent } from './ranking.component';

describe('RankingComponent', () => {
  let component: RankingComponent;
  let fixture: ComponentFixture<RankingComponent>;
  let gameService: any; // * allow to set private variables in services

  describe('Pocha game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RankingComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(PochaService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
    });

    it('should show message when game has no started', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[]];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar el ranking');
    });

    it('should show the list of players after first round entered', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [[5], [10], [-10], [5]];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const playersList = fixture.debugElement.queryAll(By.css('app-player-display'));

      expect(playersList[0].nativeElement).toHaveClass('position-1');
      expect(playersList[0].nativeElement.textContent).toContain('Player 2');
      expect(playersList[1].nativeElement).toHaveClass('position-2');
      expect(playersList[1].nativeElement.textContent).toContain('Player 1');
      expect(playersList[2].nativeElement).toHaveClass('position-2');
      expect(playersList[2].nativeElement.textContent).toContain('Player 4');
      expect(playersList[3].nativeElement).toHaveClass('position-4');
      expect(playersList[3].nativeElement.textContent).toContain('Player 3');
    });
  });

  describe('Chinchón game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RankingComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(ChinchonService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
    });

    it('should show message when game has no started', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[]];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar el ranking');
    });

    it('should show the list of players after first round entered', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [[4], [26], [11], [15]];

      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const playersList = fixture.debugElement.queryAll(By.css('app-player-display'));

      expect(playersList[0].nativeElement).toHaveClass('position-1');
      expect(playersList[0].nativeElement.textContent).toContain('Player 1');
      expect(playersList[1].nativeElement).toHaveClass('position-2');
      expect(playersList[1].nativeElement.textContent).toContain('Player 3');
      expect(playersList[2].nativeElement).toHaveClass('position-3');
      expect(playersList[2].nativeElement.textContent).toContain('Player 4');
      expect(playersList[3].nativeElement).toHaveClass('position-4');
      expect(playersList[3].nativeElement.textContent).toContain('Player 2');
    });
  });

  describe('Other game', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RankingComponent],
        providers: [
          provideRouter([]),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: GameHolderService, useClass: GameHolderService },
          provideGameService(OtherGameService),
        ],
      });
      gameService = TestBed.inject(GameHolderService).service;
    });

    it('should show message when game has no started', () => {
      gameService.playerNames = ['Player 1'];
      gameService.scores = [[]];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar el ranking');
    });

    it('should show the list of players after first round entered (winner highest score)', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [[20], [35], [46], [12]];

      gameService.winner = 'highestScore';
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const playersList = fixture.debugElement.queryAll(By.css('app-player-display'));

      expect(playersList[0].nativeElement).toHaveClass('position-1');
      expect(playersList[0].nativeElement.textContent).toContain('Player 3');
      expect(playersList[1].nativeElement).toHaveClass('position-2');
      expect(playersList[1].nativeElement.textContent).toContain('Player 2');
      expect(playersList[2].nativeElement).toHaveClass('position-3');
      expect(playersList[2].nativeElement.textContent).toContain('Player 1');
      expect(playersList[3].nativeElement).toHaveClass('position-4');
      expect(playersList[3].nativeElement.textContent).toContain('Player 4');
    });

    it('should show the list of players after first round entered (winner lowest score)', () => {
      gameService.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
      gameService.scores = [[20], [35], [46], [12]];

      gameService.winner = 'lowestScore';
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const playersList = fixture.debugElement.queryAll(By.css('app-player-display'));

      expect(playersList[0].nativeElement).toHaveClass('position-1');
      expect(playersList[0].nativeElement.textContent).toContain('Player 4');
      expect(playersList[1].nativeElement).toHaveClass('position-2');
      expect(playersList[1].nativeElement.textContent).toContain('Player 1');
      expect(playersList[2].nativeElement).toHaveClass('position-3');
      expect(playersList[2].nativeElement.textContent).toContain('Player 2');
      expect(playersList[3].nativeElement).toHaveClass('position-4');
      expect(playersList[3].nativeElement.textContent).toContain('Player 3');
    });
  });
});
