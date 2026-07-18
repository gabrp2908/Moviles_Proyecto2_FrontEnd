import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, debounceTime } from 'rxjs';
import { GamesService } from '../../core/services/games.service';
import { GameListItem, GameFilters, SortBy, SortOrder } from '../../core/models/types';
import { GameCardComponent } from '../../components/game-card/game-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, GameCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private gamesService = inject(GamesService);

  readonly GENRES = [
    { value: 'Fighting,Shooter,Hack and slash/Beat \'em up', label: 'Acción' },
    { value: 'Adventure', label: 'Aventura' },
    { value: 'Role-playing (RPG)', label: 'RPG' },
    { value: 'Shooter', label: 'Shooter' },
    { value: 'Strategy,Real Time Strategy (RTS),Turn-based strategy (TBS)', label: 'Estrategia' },
    { value: 'Sport', label: 'Deportes' },
    { value: 'Simulator', label: 'Simulador' },
    { value: 'Puzzle', label: 'Puzzle' },
    { value: 'Indie', label: 'Indie' },
  ];

  search = "";
  genre = "all";
  year = "";
  platform = "";
  sortBy: SortBy = "name";
  sortOrder: SortOrder = "asc";
  page = 1;
  showFilters = false;

  data: GameListItem[] = [];
  isLoading = false;
  isFetching = false;
  isError = false;
  errorMsg = '';

  private searchSubject = new Subject<string>();

  get hasActiveFilters(): boolean {
    return this.genre !== "all" || !!this.year || !!this.platform || !!this.search;
  }

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.page = 1;
      this.loadGames();
    });
    this.loadGames();
  }

  onSearchChange() {
    this.searchSubject.next(this.search);
  }

  onFilterChange() {
    this.page = 1;
    this.loadGames();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.onFilterChange();
  }

  clearFilters() {
    this.search = "";
    this.genre = "all";
    this.year = "";
    this.platform = "";
    this.onFilterChange();
  }

  prevPage() {
    this.page = Math.max(1, this.page - 1);
    this.loadGames();
  }

  nextPage() {
    this.page++;
    this.loadGames();
  }

  async loadGames() {
    if (this.data.length === 0) {
      this.isLoading = true;
    }
    this.isFetching = true;
    this.isError = false;

    let searchPlatform = this.platform || undefined;
    if (searchPlatform && searchPlatform.toLowerCase().trim() === 'pc') {
      searchPlatform = 'PC (Microsoft Windows)';
    }

    const filters: GameFilters = {
      page: this.page,
      limit: 20,
      search: this.search || undefined,
      genre: this.genre !== "all" ? this.genre : undefined,
      year: this.year ? Number(this.year) : undefined,
      platform: searchPlatform,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    };

    try {
      this.data = await this.gamesService.getGames(filters);
    } catch (e: any) {
      this.isError = true;
      this.errorMsg = e.message || 'Ocurrió un error al cargar los juegos.';
    } finally {
      this.isLoading = false;
      this.isFetching = false;
    }
  }
}
