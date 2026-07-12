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
  templateUrl: './game-detail.component.html'
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gamesService = inject(GamesService);
  private commentsService = inject(CommentsService);
  private auth = inject(AuthService);

  igdbId!: number;
  game: GameDetail | null = null;
  comments: Comment[] = [];
  user: User | null = null;

  isLoading = true;
  isError = false;
  errorMsg = '';
  
  commentsLoading = true;

  // Form
  editingReview: Comment | null = null;
  formScore = '8.0';
  formComment = '';
  isSubmitting = false;

  get myReview(): Comment | undefined {
    return this.comments.find(c => c.user_id === this.user?.user_id);
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    
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
      this.comments = await this.commentsService.getCommentsByGame(this.igdbId);
    } catch (e) {
      console.error(e);
    } finally {
      this.commentsLoading = false;
    }
  }

  async submitReview(existing: Comment | null) {
    if (!this.formComment.trim()) {
      alert("Escribe un comentario");
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
      await this.loadGame(); // to refresh average scores
    } catch (e: any) {
      alert(e.message || 'Error guardando reseña');
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
      alert(e.message || 'Error eliminando reseña');
    }
  }
}
