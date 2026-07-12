import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  user: User | null = null;
  isDeleting = false;

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
  }

  async handleDeleteAccount() {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente.')) {
      this.isDeleting = true;
      try {
        await this.usersService.deleteAccount();
        await this.auth.logout();
        this.router.navigate(['/']);
      } catch (e: any) {
        alert(e.error?.message || e.message || 'Error al eliminar cuenta');
        this.isDeleting = false;
      }
    }
  }
}
