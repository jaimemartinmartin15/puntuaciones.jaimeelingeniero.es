import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { BriscaService } from '../../game-services/brisca.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { provideGameService } from '../../game-services/utils';
import { BriscaComponent } from './brisca.component';

describe('BriscaComponent', () => {
  let component: BriscaComponent;
  let fixture: ComponentFixture<BriscaComponent>;
  let service: BriscaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BriscaComponent],
      providers: [
        provideRouter([]),
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: GameHolderService, useClass: GameHolderService },
        provideGameService(BriscaService),
      ],
    });
    service = TestBed.inject(GameHolderService).service as BriscaService;
    const moreThanOneDayAgo = 1000 * 60 * 60 * 24 + 1;
    localStorage.setItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER, JSON.stringify(Date.now() - moreThanOneDayAgo));
  });

  it('should not show delete banner if it was closed less than one day ago', () => {
    localStorage.setItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER, JSON.stringify(Date.now()));

    fixture = TestBed.createComponent(BriscaComponent);
    component = fixture.componentInstance;

    let deleteBanner = fixture.debugElement.query(By.css('[data-test-id="delete-banner"]'));
    expect(deleteBanner).toBeFalsy();
  });

  it('should show delete banner and allow to close it', () => {
    fixture = TestBed.createComponent(BriscaComponent);
    component = fixture.componentInstance;

    let deleteBanner = fixture.debugElement.query(By.css('[data-test-id="delete-banner"]')).nativeElement;
    expect(deleteBanner).toBeTruthy();

    const closeButtonDeleteBanner = fixture.debugElement.query(By.css('[data-test-id="delete-banner"] .close-button')).nativeElement;
    closeButtonDeleteBanner.click();

    deleteBanner = fixture.debugElement.query(By.css('[data-test-id="delete-banner"]'));
    expect(deleteBanner).toBeFalsy();
  });

  describe('Individual modality', () => {
    beforeEach(() => {
      service.modality = 'individual';
      service.playerNames = ['Player 1', 'Player 2'];
      service.scores = [4, 7];

      fixture = TestBed.createComponent(BriscaComponent);
      component = fixture.componentInstance;
    });

    it('should show tables and scores for players', () => {
      const playerNames = fixture.debugElement.queryAll(By.css('[data-test-id="player-name"]'));
      expect(playerNames[0].nativeElement.textContent).toEqual('Player 1');
      expect(playerNames[1].nativeElement.textContent).toEqual('Player 2');

      const scores = fixture.debugElement.queryAll(By.css('[data-test-id="score"]'));
      expect(scores[0].nativeElement.textContent).toEqual('(4)');
      expect(scores[1].nativeElement.textContent).toEqual('(7)');
    });

    it('should show stripes and bullets for each player', () => {
      const playerContainers = fixture.debugElement.queryAll(By.css('[data-test-id="player-container"]'));

      const stripesPlayer1 = playerContainers[0].nativeElement.querySelectorAll('[data-test-id="stripe"]');
      expect(stripesPlayer1.length).toEqual(4);

      const stripesPlayer2 = playerContainers[1].nativeElement.querySelectorAll('[data-test-id="stripe"]');
      expect(stripesPlayer2.length).toEqual(7);
      const bullet = stripesPlayer2[4].querySelector('[data-test-id="bullet"]');
      expect(bullet).toBeTruthy();
    });

    it('should allow to remove scores', () => {
      const playerContainers = fixture.debugElement.queryAll(By.css('[data-test-id="player-container"]'));
      const scores = fixture.debugElement.queryAll(By.css('[data-test-id="score"]'));

      expect(scores[0].nativeElement.textContent).toEqual('(4)');
      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(service.gameName))).toBeNull();

      playerContainers[0].nativeElement.click();
      playerContainers[0].nativeElement.click();
      playerContainers[0].nativeElement.click();
      playerContainers[0].nativeElement.click();

      expect(scores[0].nativeElement.textContent).toEqual('(4)');
      expect(service.dealingPlayerIndex).toEqual(0);

      playerContainers[0].nativeElement.click();

      expect(scores[0].nativeElement.textContent).toEqual('(3)');
      expect(service.scores).toEqual([3, 7]);
      expect(service.dealingPlayerIndex).toEqual(1);

      expect(localStorage.getItem(LOCAL_STORE_KEYS.SETTINGS(service.gameName))).not.toBeNull();
    });
  });

  describe('Team modality', () => {
    beforeEach(() => {
      service.modality = 'teams';
      service.teamNames = ['Team 1', 'Team 2'];
      service.scores = [10, 12];

      fixture = TestBed.createComponent(BriscaComponent);
      component = fixture.componentInstance;
    });

    it('should show tables and scores for teams', () => {
      const teamNames = fixture.debugElement.queryAll(By.css('[data-test-id="player-name"]'));
      expect(teamNames[0].nativeElement.textContent).toEqual('Team 1');
      expect(teamNames[1].nativeElement.textContent).toEqual('Team 2');

      const scores = fixture.debugElement.queryAll(By.css('[data-test-id="score"]'));
      expect(scores[0].nativeElement.textContent).toEqual('(10)');
      expect(scores[1].nativeElement.textContent).toEqual('(12)');
    });

    it('should show stripes and bullets for each team', () => {
      let playerContainers = fixture.debugElement.queryAll(By.css('[data-test-id="player-container"]'));

      let stripesTeam1 = playerContainers[0].nativeElement.querySelectorAll('[data-test-id="stripe"]');
      expect(stripesTeam1.length).toEqual(10);

      let stripesTeam2 = playerContainers[1].nativeElement.querySelectorAll('[data-test-id="stripe"]');
      expect(stripesTeam2.length).toEqual(12);
      const bullet = stripesTeam2[9].querySelector('[data-test-id="bullet"]');
      expect(bullet.textContent).toEqual('10');
    });
  });
});
