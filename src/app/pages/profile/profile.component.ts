import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private usersService = inject(UsersService);
  private router = inject(Router);

  user: User | null = null;
  isDeleting = false;
  
  isEditing = false;
  isSaving = false;
  editName = '';
  editEmail = '';
  editPassword = '';

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
  }

  startEditing() {
    if (this.user) {
      this.editName = this.user.user_na;
      this.editEmail = this.user.user_mail;
      this.editPassword = '';
      this.isEditing = true;
    }
  }

  async handleUpdateProfile() {
    if (!this.editName.trim() || !this.editEmail.trim()) {
      alert('El nombre y el correo no pueden estar vacíos.');
      return;
    }

    this.isSaving = true;
    try {
      const data: { name?: string; email?: string; password?: string } = {
        name: this.editName,
        email: this.editEmail,
      };
      if (this.editPassword) {
        data.password = this.editPassword;
      }

      await this.usersService.updateProfile(data);
      await this.auth.loadMe();
      this.isEditing = false;
    } catch (e: any) {
      alert(e.error?.message || e.message || 'Error al actualizar el perfil.');
    } finally {
      this.isSaving = false;
    }
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
