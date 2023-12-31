import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ChinchonService } from '../../../game-services/chinchon.service';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { OtherGameService } from '../../../game-services/other-game.service';
import { PochaService } from '../../../game-services/pocha.service';
import { provideGameService } from '../../../game-services/utils';
import { ProgressGraphComponent } from './progress-graph.component';
import { Type } from '@angular/core';
import { GameService } from '../../../game-services/game.service';

const SELECTORS = {
  GRAPH: '[data-test-id="graph"]',
  ROUND_PANEL_INFO: '[data-test-id="round-panel-info"]',
};

describe('ProgressGraphComponent', () => {
  let component: ProgressGraphComponent;
  let fixture: ComponentFixture<ProgressGraphComponent>;
  let gameHolderService: GameHolderService;

  function describeGame(gameName: string, gameService: Type<GameService>) {
    describe(gameName, () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ProgressGraphComponent],
          providers: [
            provideRouter([]),
            { provide: ComponentFixtureAutoDetect, useValue: true },
            { provide: GameHolderService, useClass: GameHolderService },
            provideGameService(gameService),
          ],
        });

        gameHolderService = TestBed.inject(GameHolderService);
        gameHolderService.service.players = [
          { id: 0, name: 'Player 1', scores: [10, 20, -10], punctuation: 0 },
          { id: 1, name: 'Player 2', scores: [5, -10, 5], punctuation: 0 },
          { id: 2, name: 'Player 3', scores: [5, 5, -10], punctuation: 0 },
        ];
        fixture = TestBed.createComponent(ProgressGraphComponent);
        component = fixture.componentInstance;
      });

      it('should calculate the lines for each player', () => {
        expect(component.playerLines.length).toBe(3);
      });

      it('should show panel info when clicking the graph', () => {
        expect(fixture.debugElement.query(By.css(SELECTORS.ROUND_PANEL_INFO))).toBeNull();

        fixture.debugElement.query(By.css(SELECTORS.GRAPH)).nativeElement.dispatchEvent(
          new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 40,
          })
        );
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(SELECTORS.ROUND_PANEL_INFO))).toBeDefined();

        fixture.debugElement.query(By.css(SELECTORS.GRAPH)).nativeElement.dispatchEvent(
          new MouseEvent('mousedown', {
            clientX: 100,
            clientY: 40,
          })
        );
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css(SELECTORS.ROUND_PANEL_INFO))).toBeNull();
      });
    });
  }

  describeGame('Pocha game', PochaService);
  describeGame('Chinchón game', ChinchonService);
  describeGame('Other game', OtherGameService);
});
