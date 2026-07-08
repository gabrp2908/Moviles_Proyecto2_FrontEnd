import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GameListItem, GameDetail, GameFilters } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private http = inject(HttpClient);

  async getGames(filters: GameFilters): Promise<GameListItem[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    const response = await firstValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/games`, { params })
    );
    return response.map(g => ({ ...g, anio: g.año }));
  }

  async getGameById(igdbId: number): Promise<GameDetail> {
    const response = await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/games/${igdbId}`)
    );
    return { ...response, anio: response.año };
  }
}
