import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(Storage);
  private router = inject(Router);
  
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  private storageReady = false;

  constructor() {
    this.initStorage();
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  private async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    const token = await this.storage.get('gs_token');
    if (token) {
      try {
        await this.loadMe();
      } catch (e) {
        await this.storage.remove('gs_token');
      }
    }
  }

  async getTokenAsync(): Promise<string | null> {
    if (!this.storageReady) {
      await this.storage.create();
      this.storageReady = true;
    }
    return this.storage.get('gs_token');
  }

  async login(credentials: any): Promise<AuthResponse> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/mobile-login`, credentials)
    );
    await this.storage.set('gs_token', res.access_token);
    this.userSubject.next(res.user);
    return res;
  }

  async register(data: any): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/register`, data)
    );
  }

  async loadMe(): Promise<User> {
    const user = await firstValueFrom(
      this.http.get<User>(`${environment.apiUrl}/auth/me`)
    );
    this.userSubject.next(user);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/logout`, {}));
    } catch (e) {
      // Ignore error on logout
    } finally {
      await this.storage.remove('gs_token');
      this.userSubject.next(null);
      this.router.navigate(['/']);
    }
  }

  async forgetPassword(email: string): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/forget-password`, { email })
    );
  }

  async verifyReset(email: string, token: string): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/verify-reset`, { email, token })
    );
  }

  async resetPassword(data: any): Promise<any> {
    return firstValueFrom(
      this.http.post(`${environment.apiUrl}/auth/reset-password`, data)
    );
  }
}
