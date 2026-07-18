import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { GamesService } from '../../core/services/games.service';
import { CommentsService } from '../../core/services/comments.service';
import { AuthService } from '../../core/services/auth.service';
import { GameDetail, Comment, User } from '../../core/models/types';
import { ScoreBadgeComponent } from '../../components/score-badge/score-badge.component';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, ScoreBadgeComponent],
  templateUrl: './game-detail.component.html',
  styles: [`
    :host {
      display: block;
    }

    .stardrop-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 14px;
      border-radius: 999px;
      background: linear-gradient(90deg, #ff4d4d 0%, #2f6bff 100%);
      border: none;
      outline: none;
      cursor: pointer;
      padding: 0;
      margin: 0.75rem 0 0.5rem;
    }

    .stardrop-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: url('/assets/stardrop.png') center/cover no-repeat;
      box-shadow: none;
      margin-top: -15px;
    }

    .stardrop-slider::-moz-range-thumb {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: url('/assets/stardrop.png') center/cover no-repeat;
      box-shadow: none;
    }

    .stardrop-slider::-webkit-slider-runnable-track {
      height: 14px;
      border-radius: 999px;
      background: transparent;
    }

    .stardrop-slider::-moz-range-track {
      height: 14px;
      border-radius: 999px;
      background: transparent;
    }
  `]
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gamesService = inject(GamesService);
  private commentsService = inject(CommentsService);
  private auth = inject(AuthService);

  igdbId!: number;
  game: GameDetail | null = null;
  userComments: Comment[] = [];
  criticComments: Comment[] = [];
  user: User | null = null;

  isLoading = true;
  isError = false;
  errorMsg = '';
  commentsLoading = true;

  activeTab: 'User' | 'Critic' = 'User';

  // Form
  editingReview: Comment | null = null;
  formScore = '8.0';
  formComment = '';
  isSubmitting = false;

  get activeComments(): Comment[] {
    return this.activeTab === 'User' ? this.userComments : this.criticComments;
  }

  // Returns the current user's review only for the currently active tab
  get myReview(): Comment | undefined {
    return this.activeComments.find(c => c.user_id === this.user?.user_id);
  }

  get isCritic(): boolean {
    return this.user?.role === 'Critic';
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);

    // Refresh user role from DB on every page load
    // This ensures role changes by admin take effect immediately
    this.auth.loadMe().catch(() => { /* not logged in, ignore */ });

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('igdbId');
      if (idStr) {
        this.igdbId = parseInt(idStr, 10);
        this.loadGame();
        this.loadComments();
      }
    });
  }

  async loadGame() {
    this.isLoading = true;
    this.isError = false;
    try {
      this.game = await this.gamesService.getGameById(this.igdbId);
    } catch (e: any) {
      this.isError = true;
      this.errorMsg = e.statusCode === 404 ? 'Este juego no existe.' : (e.message || 'Error loading game.');
    } finally {
      this.isLoading = false;
    }
  }

  async loadComments() {
    this.commentsLoading = true;
    try {
      const [userComments, criticComments] = await Promise.all([
        this.commentsService.getCommentsByRole(this.igdbId, 'User'),
        this.commentsService.getCommentsByRole(this.igdbId, 'Critic'),
      ]);
      this.userComments = userComments;
      this.criticComments = criticComments;
    } catch (e) {
      console.error(e);
    } finally {
      this.commentsLoading = false;
    }
  }

  setTab(tab: 'User' | 'Critic') {
    this.activeTab = tab;
    this.editingReview = null;
    this.formScore = '8.0';
    this.formComment = '';
  }

  async submitReview(existing: Comment | null) {
    if (!this.formComment.trim()) {
      alert('Escribe un comentario');
      return;
    }

    this.isSubmitting = true;
    const s = Number(this.formScore);

    try {
      if (existing) {
        await this.commentsService.updateComment(existing._id, { score: s, comment: this.formComment });
        this.editingReview = null;
      } else {
        await this.commentsService.createComment({ igdb_id: this.igdbId, score: s, comment: this.formComment });
      }
      this.formScore = '8.0';
      this.formComment = '';
      await this.loadComments();
      await this.loadGame();
    } catch (e: any) {
      alert(e.error?.message || e.message || 'Error guardando reseña');
    } finally {
      this.isSubmitting = false;
    }
  }

  async deleteReview(id: string) {
    if (!confirm('¿Eliminar tu reseña? Esta acción no se puede deshacer.')) return;
    try {
      await this.commentsService.deleteComment(id);
      await this.loadComments();
      await this.loadGame();
    } catch (e: any) {
      alert(e.error?.message || e.message || 'Error eliminando reseña');
    }
  }
}
