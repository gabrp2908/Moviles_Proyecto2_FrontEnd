import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);

  async getCommentsByGame(igdbId: number): Promise<Comment[]> {
    const res = await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/comments/game/${igdbId}?limit=50`)
    );
    return res.data || [];
  }

  async getCommentsByRole(igdbId: number, role: 'User' | 'Critic'): Promise<Comment[]> {
    const res = await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/comments/game/${igdbId}?role=${role}&limit=50`)
    );
    const data: Comment[] = res.data || [];
    // Safety filter: ensure each comment matches the requested role
    return data.filter(c => c.role_at_creation === role);
  }

  async createComment(data: { igdb_id: number; score: number; comment: string }): Promise<Comment> {
    return firstValueFrom(
      this.http.post<Comment>(`${environment.apiUrl}/comments`, data)
    );
  }

  async updateComment(id: string, data: { score?: number; comment?: string }): Promise<Comment> {
    return firstValueFrom(
      this.http.put<Comment>(`${environment.apiUrl}/comments/${id}`, data)
    );
  }

  async deleteComment(id: string): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${environment.apiUrl}/comments/${id}`)
    );
  }
}
