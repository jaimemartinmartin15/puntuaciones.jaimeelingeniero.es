import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { BriscaService } from '../../game-services/brisca.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { intervalArray } from '../../utils/arrays';

interface Row {
  name: string;
  score: number;
}

@Component({
  selector: 'app-brisca',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent],
  templateUrl: './brisca.component.html',
  styleUrls: ['./brisca.component.scss'],
})
export class BriscaComponent implements OnInit {
  public readonly GAP_STRIPE = 7;
  public svgHeight: number;
  public rows: Row[][] = [];

  public briscaService: BriscaService;

  public constructor(gameHolderService: GameHolderService) {
    if (!(gameHolderService.service instanceof BriscaService)) {
      throw new Error('Cannot load Brisca component because game holder service does not contain a BriscaService');
    }

    this.briscaService = gameHolderService.service;
  }

  public ngOnInit(): void {
    let names: string[] = [];
    if (this.briscaService.modality === 'individual') {
      names = this.briscaService.playerNames;
    } else if (this.briscaService.modality === 'teams') {
      names = this.briscaService.teamNames;
    }

    for (let i = 0; i < names.length; i += 2) {
      this.rows.push(names.slice(i, i + 2).map((name) => ({ name, score: this.briscaService.scores[i] })));
    }
  }

  public getViewBoxForRow(row: Row[]): string {
    this.svgHeight = 40 + Math.max(row[0].score, row[1]?.score ?? 0) * this.GAP_STRIPE;
    return `0 0 100 ${this.svgHeight}`;
  }

  public arrayOf(n: number): number[] {
    return intervalArray(n);
  }

  public random(): number {
    // -1, 0 or +1
    return Math.floor(Math.random() * 3) - 1;
  }
}
