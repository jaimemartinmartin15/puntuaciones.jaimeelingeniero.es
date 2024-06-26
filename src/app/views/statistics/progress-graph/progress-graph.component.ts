import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Flag } from '../../../game-services/flags';
import { GameHolderService } from '../../../game-services/game-holder.service';
import { GameService, GameServiceWithFlags } from '../../../game-services/game.service';
import { intervalArray } from '../../../utils/arrays';
import { SvgRoundMarker } from './svg-round-marker';
import { ToEmojiPipe } from './to-emoji.pipe';

const PROGRESS_GRAPH_FLAGS = ['statistics:progressGraph'] as const; //as Flag[]

@Component({
  selector: 'app-progress-graph',
  standalone: true,
  imports: [CommonModule, ToEmojiPipe],
  templateUrl: './progress-graph.component.html',
  styleUrls: ['./progress-graph.component.scss'],
})
export class ProgressGraphComponent implements OnInit {
  public gameService: GameService & GameServiceWithFlags<(typeof PROGRESS_GRAPH_FLAGS)[number]>;

  @ViewChild('graph')
  private readonly graph: ElementRef;

  public viewBox: string;
  public showPlayerGraphLines: boolean[];
  public colors: string[] = ['#ff0000', '#0000ff', '#008000', '#804000', '#4cd3d3', '#9d9d9d', '#c32aed', '#e0e000'];
  public playerLines: string[];

  public showRoundPanel = false;
  public svgSelectedRound: { x1: number; y1: number; x2: number; y2: number };
  public selectedRound: number = -1;
  public roundPanelPlayers: number[];
  public playerMovements: number[];

  public constructor(readonly gameHolderService: GameHolderService) {
    if (!gameHolderService.service.isGameServiceWithFlags(PROGRESS_GRAPH_FLAGS as unknown as Flag[])) {
      throw new Error(
        `Error ProgressGraphComponent: service '${gameHolderService.service.gameName}' does not implement flags [${PROGRESS_GRAPH_FLAGS.join(', ')}]`
      );
    }

    this.gameService = gameHolderService.service;
  }

  public ngOnInit(): void {
    this.viewBox = `0 0 ${this.gameService.svgWidth + 1} ${this.gameService.svgHeight}`;
    this.showPlayerGraphLines = new Array(this.gameService.playerNames.length).fill(true);
    this.createColorsForPlayers();
    this.playerLines = this.gameService.playerNames.map((_, id) => this.gameService.getSvgPlayerLine(id));
  }

  private createColorsForPlayers() {
    const numberOfPlayersToCreateColors = this.gameService.playerNames.length - this.colors.length;
    if (numberOfPlayersToCreateColors > 0) {
      const chars = '0123456789ABCDEF';
      for (let i = 0; i < numberOfPlayersToCreateColors; i++) {
        let color = '#';
        for (let j = 0; j < 6; j++) {
          color += chars[Math.floor(Math.random() * chars.length)];
        }
        this.colors.push(color);
      }
    }

    // adds transparency to all existing colors
    this.colors = this.colors.map((c) => c + 'CC');
  }

  public get svgRoundMarkers(): SvgRoundMarker[] {
    const showEvery = 5;
    const numberOfMarkersToShow = (this.gameService.getNextRoundNumber() - 1) / showEvery;
    const svgRoundWidth = this.gameService.svgWidth / (this.gameService.getNextRoundNumber() - 1);

    return intervalArray(numberOfMarkersToShow).map((m) => ({
      value: m * showEvery,
      text: { x: svgRoundWidth * m * showEvery - 5, y: -this.gameService.svgXAxisHeight - 4 },
      line: {
        x1: svgRoundWidth * m * showEvery,
        y1: 0,
        x2: svgRoundWidth * m * showEvery,
        y2: this.gameService.svgHeight,
      },
    }));
  }

  public onClickToShowPlayersPanelInfo(event: MouseEvent): void {
    const calculatedRound = this.calculateSelectedRoundOnClick({ x: event.offsetX, y: event.offsetY });
    this.showRoundInfo(calculatedRound);
  }

  public showRoundInfo(round: number) {
    if (round === this.selectedRound) {
      this.selectedRound = -1;
      this.showRoundPanel = false;
      return;
    }

    this.selectedRound = round;
    this.roundPanelPlayers = this.gameService.getRankingPlayers(this.selectedRound);

    this.calculateSelectedRoundSvg(this.selectedRound);

    // calculate only player movements after round two
    if (this.selectedRound > 1) {
      const positionsBefore = this.gameService.playerNames.map((_, id) => this.gameService.getPlayerPosition(id, this.selectedRound - 1));
      const positionsNow = this.gameService.playerNames.map((_, id) => this.gameService.getPlayerPosition(id, this.selectedRound));
      this.playerMovements = this.gameService.playerNames.map((_, id) => positionsBefore[id] - positionsNow[id]);
    }

    this.showRoundPanel = true;
  }

  private calculateSelectedRoundSvg(round: number) {
    const numberOfRounds = this.gameService.getNextRoundNumber() - 1;
    const roundWidth = this.gameService.svgWidth / numberOfRounds;
    const roundsPositions = intervalArray(numberOfRounds).map((r) => r * roundWidth);

    this.svgSelectedRound = {
      x1: roundsPositions[round - 1],
      y1: 0,
      x2: roundsPositions[round - 1],
      y2: this.gameService.svgHeight,
    };
  }

  private calculateSelectedRoundOnClick({ x: xCoord, y: yCoord }: { x: number; y: number }): number {
    // convert click in screen to coordinates in svg
    const point = DOMPoint.fromPoint(this.graph.nativeElement);
    point.x = xCoord;
    point.y = yCoord;
    const svgXCoord = point.matrixTransform(this.graph.nativeElement.getCTM().inverse()).x;

    // calculate the round
    const numberOfRounds = this.gameService.getNextRoundNumber() - 1;
    const roundWidth = this.gameService.svgWidth / numberOfRounds;
    const roundsPositions = intervalArray(numberOfRounds).map((r) => r * roundWidth);

    return roundsPositions.findIndex((svgRoundPosition) => svgRoundPosition > svgXCoord) + 1;
  }
}
