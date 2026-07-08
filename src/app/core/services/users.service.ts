import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRole } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);

  async updateProfile(data: { name?: string; email?: string; password?: string }): Promise<{ message: string; user: User }> {
    return firstValueFrom(
      this.http.put<{ message: string; user: User }>(`${environment.apiUrl}/users/profile`, data)
    );
  }

  async deleteAccount(): Promise<any> {
    return firstValueFrom(
      this.http.delete(`${environment.apiUrl}/users/account`)
    );
  }

  async searchUser(email: string): Promise<User> {
    return firstValueFrom(
      this.http.get<User>(`${environment.apiUrl}/users/search`, { params: { email } })
    );
  }

  async changeRole(userId: string, role: UserRole): Promise<User> {
    return firstValueFrom(
      this.http.patch<User>(`${environment.apiUrl}/users/${userId}/role`, { role })
    );
  }
}
