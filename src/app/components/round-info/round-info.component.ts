import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTING_PATHS } from '../../app.routes';
import { GameHolderService } from '../../game-services/game-holder.service';

@Component({
  selector: 'app-round-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './round-info.component.html',
  styleUrls: ['./round-info.component.scss'],
})
export class RoundInfoComponent {
  public constructor(
    public readonly gameHolderService: GameHolderService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  @HostListener('click')
  public navigateToChangeConfig() {
    // the condition is to ensure the player names were saved in local storage after
    // entering first round and they do not appear empty
    if (this.isNotFirstRound) {
      this.router.navigate(['../', ROUTING_PATHS.CHANGE_CONFIG], { relativeTo: this.activatedRoute });
    }
  }

  @HostBinding('class.clickable')
  public get isNotFirstRound(): boolean {
    return this.gameHolderService.service.getNextRoundNumber() > 1;
  }
}
