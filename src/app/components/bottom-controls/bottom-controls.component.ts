import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROUTING_PATHS } from '../../constants/routes';
import { GameHolderService } from '../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../game-services/game.service';

@Component({
  selector: 'app-bottom-controls',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-controls.component.html',
  styleUrls: ['./bottom-controls.component.scss'],
})
export class BottomControlsComponent {
  public gameService: GameService;
  public showViewNavigation: boolean = false;

  public constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    readonly gameHolderService: GameHolderService
  ) {
    this.gameService = this.gameHolderService.service;
  }

  public goToGameConfigView() {
    this.router.navigate(['../', ROUTING_PATHS.GAME_CONFIG], { relativeTo: this.activatedRoute });
  }

  public enterNewRound() {
    let state: { [k: string]: any } = {};
    if (this.gameService.hasFlagActive('bottomControls:newRound:state')) {
      state = this.gameService.getStateEnterNewRound();
    }
    // this method is only invoked when clicking the new round button
    // and it is only shown if 'bottomControls:newRound' is implemented
    const gameService = this.gameService as any as GameServiceWithFlags<'bottomControls:newRound'>;
    this.router.navigate(['../', gameService.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }
}
