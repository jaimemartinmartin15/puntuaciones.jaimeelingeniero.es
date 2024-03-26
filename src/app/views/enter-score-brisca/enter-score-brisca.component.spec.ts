import { Location } from '@angular/common';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { BriscaService } from '../../game-services/brisca.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { provideGameService } from '../../game-services/utils';
import { EnterScoreBriscaComponent } from './enter-score-brisca.component';

const SELECTORS = {
  CLOSE_BUTTON: '[data-test-id="close-button"]',
  PLAYER: (index: number) => `[data-test-id="player-${index}"]`,
};

describe('EnterScoreBriscaComponent', () => {
  let locationBackSpy: jasmine.Spy;
  let fixture: ComponentFixture<EnterScoreBriscaComponent>;
  let service: BriscaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnterScoreBriscaComponent],
      providers: [
        provideRouter([]),
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: GameHolderService, useClass: GameHolderService },
        provideGameService(BriscaService),
      ],
    });
    localStorage.clear();
    service = TestBed.inject(GameHolderService).service as BriscaService;
    service.modality = 'teams';
    service.teamNames = ['Team 1', 'Team 2'];
    service.playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
    service.scores = [10, 12];
    locationBackSpy = spyOn(TestBed.inject(Location), 'back');
    fixture = TestBed.createComponent(EnterScoreBriscaComponent);
  });

  it('should allow to cancel without saving changes', () => {
    fixture.debugElement.query(By.css(SELECTORS.CLOSE_BUTTON)).nativeElement.click();
    expect(locationBackSpy).toHaveBeenCalled();
    expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(service.gameName))).toBeNull();
  });

  it('should allow you to select for whom the point is', () => {
    fixture.debugElement.query(By.css(SELECTORS.PLAYER(0))).nativeElement.click();

    expect(service.scores[0]).toEqual(11);
    expect(service.dealingPlayerIndex).toEqual(1);
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(service.gameName))!);
    expect(savedData).toEqual({
      modality: 'teams',
      playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
      scores: [11, 12],
      dealingPlayerIndex: 1,
      teamNames: ['Team 1', 'Team 2'],
    });
    expect(locationBackSpy).toHaveBeenCalled();
  });
});
