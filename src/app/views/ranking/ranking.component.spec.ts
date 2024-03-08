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
  let gameHolderService: GameHolderService;

  describe('Pocha game', () => {
    let service: PochaService;

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
      gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as PochaService;
    });

    it('should show message when game has no started', () => {
      service.players = [{ id: 0, name: 'Player 1', scores: [], punctuation: 0 }];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar el ranking');
    });

    it('should show the list of players after first round entered', () => {
      service.players = [
        { id: 0, name: 'Player 1', scores: [5], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [10], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [-10], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [5], punctuation: 0 },
      ];
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
    let service: ChinchonService;

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
      gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as ChinchonService;
    });

    it('should show message when game has no started', () => {
      service.players = [{ id: 0, name: 'Player 1', scores: [], punctuation: 0 }];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar el ranking');
    });

    it('should show the list of players after first round entered', () => {
      service.players = [
        { id: 0, name: 'Player 1', scores: [4], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [26], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [11], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [15], punctuation: 0 },
      ];
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
    let service: OtherGameService;

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
      gameHolderService = TestBed.inject(GameHolderService);
      service = gameHolderService.service as OtherGameService;
    });

    it('should show message when game has no started', () => {
      service.players = [{ id: 0, name: 'Player 1', scores: [], punctuation: 0 }];
      fixture = TestBed.createComponent(RankingComponent);
      component = fixture.componentInstance;

      const emptyMessage = fixture.debugElement.query(By.css('.empty-state')).nativeElement.textContent;
      expect(emptyMessage).toContain('Introduce al menos una ronda para mostrar el ranking');
    });

    it('should show the list of players after first round entered (winner highest score)', () => {
      service.players = [
        { id: 0, name: 'Player 1', scores: [20], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [35], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [46], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [12], punctuation: 0 },
      ];
      service.winner = 'highestScore';
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
      service.players = [
        { id: 0, name: 'Player 1', scores: [20], punctuation: 0 },
        { id: 1, name: 'Player 2', scores: [35], punctuation: 0 },
        { id: 2, name: 'Player 3', scores: [46], punctuation: 0 },
        { id: 3, name: 'Player 4', scores: [12], punctuation: 0 },
      ];
      service.winner = 'lowestScore';
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
