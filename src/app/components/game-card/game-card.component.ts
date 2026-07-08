import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameListItem } from '../../core/models/types';
import { ScoreBadgeComponent } from '../score-badge/score-badge.component';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [RouterModule, ScoreBadgeComponent],
  templateUrl: './game-card.component.html'
})
export class GameCardComponent {
  @Input({ required: true }) game!: GameListItem;
}
