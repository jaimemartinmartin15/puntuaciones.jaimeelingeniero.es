import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BottomControlsComponent } from '../../components/bottom-controls/bottom-controls.component';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';
import { LOCAL_STORE_KEYS } from '../../constants/local-storage-keys';
import { BriscaService } from '../../game-services/brisca.service';
import { GameHolderService } from '../../game-services/game-holder.service';
import { intervalArray } from '../../utils/arrays';

@Component({
  selector: 'app-brisca',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent, BottomControlsComponent],
  templateUrl: './brisca.component.html',
  styleUrls: ['./brisca.component.scss'],
})
export class BriscaComponent implements OnInit {
  private scoreClicks: number[] = [];
  private CLICKS_TO_DELETE_POINT = 3;

  public readonly HORIZONTAL_SEPARATOR_HEIGHT = 12;
  public readonly GAP_STRIPE = 7;
  public readonly BULLET_INTERVAL = 5;

  public svgHeight: number;

  public pairNames: string[][] = [];
  public pairScores: number[][] = [];
  // pair - left or right - stripe index
  public svgPairStripes: string[][][] = [];
  // pair - left or right - bullet index - x,y of circle and text
  public svgBulletPairs: number[][][][] = [];

  public showDeleteBanner = true;

  public briscaService: BriscaService;

  public constructor(gameHolderService: GameHolderService) {
    if (!(gameHolderService.service instanceof BriscaService)) {
      throw new Error('Cannot load Brisca component because game holder service does not contain a BriscaService');
    }

    this.briscaService = gameHolderService.service;
  }

  public ngOnInit(): void {
    // calculate if the delete banner has to be shown
    const lastTimeDeleteBanner = localStorage.getItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER);
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.showDeleteBanner = lastTimeDeleteBanner === null || oneDayAgo > +lastTimeDeleteBanner;

    let names: string[] = [];
    if (this.briscaService.modality === 'individual') {
      names = this.briscaService.playerNames;
    } else if (this.briscaService.modality === 'teams') {
      names = this.briscaService.teamNames;
    }

    this.scoreClicks = names.map(() => 0);

    // generate pairs for names (header)
    for (let i = 0; i < names.length; i += 2) {
      this.pairNames.push([names[i], names[i + 1]]);
    }

    // generate pairs for scores (header)
    for (let i = 0; i < names.length; i += 2) {
      this.pairScores.push([this.briscaService.scores[i], this.briscaService.scores[i + 1]]);
    }

    // generate pairs for stripes and bullets
    for (let i = 0; i < names.length; i += 2) {
      this.svgBulletPairs.push([[], []]);
      this.svgPairStripes.push([this.getSvgStripesForNameIndex(i), this.getSvgStripesForNameIndex(i + 1)]);
    }
  }

  private getSvgStripesForNameIndex(i: number): string[] {
    const highStart = 12;

    return intervalArray(this.briscaService.scores[i]).map((stripeN) => {
      const stripeLenght = (i % 2 === 0 ? 20 : 80) + Math.floor(Math.random() * 5) - 2; // -2 ... 2
      const gapStripeOffset = Math.floor(Math.random() * 3) - 1; // -1 ... 1
      const stripeHigh = highStart + stripeN * this.GAP_STRIPE + gapStripeOffset;

      // generate a bullet for the stripe
      if (stripeN % this.BULLET_INTERVAL === 0) {
        this.svgBulletPairs[Math.floor(i / 2)][i % 2].push([stripeLenght, stripeHigh]);
      }

      return `M 50,${stripeHigh} ${stripeLenght},${stripeHigh}`;
    });
  }

  public getViewBoxForSvgPair(i: number): string {
    const minimumVerticalSeparatorHeight = this.HORIZONTAL_SEPARATOR_HEIGHT + 20;
    this.svgHeight = minimumVerticalSeparatorHeight + Math.max(this.pairScores[i][0], this.pairScores[i][1] ?? 0) * this.GAP_STRIPE;
    return `0 0 100 ${this.svgHeight}`;
  }

  public closeDeleteBanner() {
    this.showDeleteBanner = false;
    localStorage.setItem(LOCAL_STORE_KEYS.BRISCA_LAST_TIME_DELETE_BANNER, JSON.stringify(Date.now()));
  }

  public changeScoreOf(scoreIndex: number) {
    this.scoreClicks[scoreIndex]++;
    const stripe = this.svgPairStripes[Math.floor(scoreIndex / 2)][scoreIndex % 2].at(-1); // pick last stripe
    if (stripe) {
      // divide by white space and comma
      const length: number = +stripe.split(/ |,/).at(-2)!.trim();

      // calculate new length
      let newLength;
      if (scoreIndex % 2 === 0) {
        newLength = 20 + (this.scoreClicks[scoreIndex] * 30) / this.CLICKS_TO_DELETE_POINT;
      } else {
        newLength = 80 - (this.scoreClicks[scoreIndex] * 30) / this.CLICKS_TO_DELETE_POINT;
      }

      // build new stripe and replace it
      const newStripe = stripe.replaceAll(`${length}`, `${newLength}`);
      this.svgPairStripes[Math.floor(scoreIndex / 2)][scoreIndex % 2].pop();
      this.svgPairStripes[Math.floor(scoreIndex / 2)][scoreIndex % 2].push(newStripe);
    }
    if (this.scoreClicks[scoreIndex] === this.CLICKS_TO_DELETE_POINT && this.briscaService.scores[scoreIndex] > 0) {
      this.scoreClicks[scoreIndex] = 0;
      this.briscaService.scores[scoreIndex]--;
      this.pairScores[Math.floor(scoreIndex / 2)][scoreIndex % 2]--;
      this.svgPairStripes[Math.floor(scoreIndex / 2)][scoreIndex % 2].pop();
      this.briscaService.setPreviousDealingPlayerIndex();
      this.briscaService.saveStateToLocalStorage();
    }
  }
}
