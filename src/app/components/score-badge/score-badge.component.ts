import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-badge.component.html'
})
export class ScoreBadgeComponent {
  @Input() score: number = 0;
  @Input() label?: string;
  @Input() variant: 'user' | 'critic' = 'user';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get hasScore(): boolean {
    return this.score > 0;
  }

  getDimsClass(): string {
    if (this.size === 'lg') return 'h-16 w-16 text-2xl';
    if (this.size === 'sm') return 'h-9 w-9 text-sm';
    return 'h-12 w-12 text-lg';
  }

  getScoreColor(): string {
    if (this.score >= 7.5) return 'var(--blue)';
    if (this.score >= 5) return 'var(--pink)';
    return 'var(--red)';
  }
}
