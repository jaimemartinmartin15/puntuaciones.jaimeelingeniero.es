import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ROUTING_PATHS } from '../../constants/routes';
import { GameHolderService } from '../../game-services/game-holder.service';

@Component({
  selector: 'app-bottom-controls',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-controls.component.html',
  styleUrls: ['./bottom-controls.component.scss'],
})
export class BottomControlsComponent {
  public showViewNavigation: boolean = false;

  public constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    public readonly gameHolderService: GameHolderService
  ) {}

  public goToGameConfigView() {
    this.router.navigate(['../', ROUTING_PATHS.GAME_CONFIG], { relativeTo: this.activatedRoute });
  }

  public enterNewRound() {
    let state: { [k: string]: any } = {};
    if (this.gameHolderService.service.hasFlagActive('bottomControls:newRound:state')) {
      state = this.gameHolderService.service.getStateEnterNewRound();
    }
    this.router.navigate(['../', this.gameHolderService.service.enterScoreRoute], { relativeTo: this.activatedRoute, state });
  }
}
