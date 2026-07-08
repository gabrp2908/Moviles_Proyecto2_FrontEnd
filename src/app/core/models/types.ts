export type UserRole = 'User' | 'Critic' | 'Admin' | 'NoUser';

export interface User {
  user_id: string;
  user_na: string;
  user_mail: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface GameListItem {
  id: number;
  igdb_id: number;
  nombre: string;
  anio: number;
  caratula: string;
  promedio_puntuacion_usuarios: number;
  promedio_puntuacion_criticos: number;
}

export interface GameDetail extends GameListItem {
  generos: string[];
  plataformas: string[];
  descripcion: string;
  developers: string[];
  temas: string[];
  modos_de_juego: string[];
}

export interface Comment {
  _id: string;
  user_id: string;
  user_na: string;
  igdb_id: number;
  score: number;
  comment: string;
  role_at_creation: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type SortBy = 'name' | 'year' | 'userScore' | 'criticScore';
export type SortOrder = 'asc' | 'desc';

export interface GameFilters {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  platform?: string;
  year?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
