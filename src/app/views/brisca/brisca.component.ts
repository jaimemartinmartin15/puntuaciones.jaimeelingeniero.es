import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RoundInfoComponent } from '../../components/round-info/round-info.component';

@Component({
  selector: 'app-brisca',
  standalone: true,
  imports: [CommonModule, RoundInfoComponent],
  templateUrl: './brisca.component.html',
  styleUrls: ['./brisca.component.scss'],
})
export class BriscaComponent {}
