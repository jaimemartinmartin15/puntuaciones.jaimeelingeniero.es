import { Type } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ChinchonService } from '../../../game-services/chinchon.service';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { GameService } from '../../../game-services/game.service';
import { OtherGameService } from '../../../game-services/other-game.service';
import { PochaService } from '../../../game-services/pocha.service';
import { provideGameService } from '../../../game-services/utils';
import { ProgressGraphComponent } from './progress-graph.component';

const SELECTORS = {
  GRAPH: '[data-test-id="graph"]',
  ROUND_PANEL_INFO: '[data-test-id="round-panel-info"]',
};

describe('ProgressGraphComponent', () => {
  let component: ProgressGraphComponent;
  let fixture: ComponentFixture<ProgressGraphComponent>;
  let gameService: any; // * allow to set private variables in services

  function describeGame(gameName: string, gameServiceType: Type<GameService>) {
    describe(gameName, () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ProgressGraphComponent],
          providers: [
            provideRouter([]),
            { provide: ComponentFixtureAutoDetect, useValue: true },
            { provide: GameHolderService, useClass: GameHolderService },
            provideGameService(gameServiceType),
          ],
        });

        gameService = TestBed.inject(GameHolderService).service;
        gameService.playerNames = ['Player 1', 'Player 2', 'Player 3'];
        gameService.scores = [
          [10, 20, -10],
          [5, -10, 5],
          [5, 5, -10],
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
