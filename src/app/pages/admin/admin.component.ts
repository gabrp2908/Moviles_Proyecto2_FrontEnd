import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UsersService } from '../../core/services/users.service';
import { User, UserRole } from '../../core/models/types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  private usersService = inject(UsersService);

  searchEmail = '';
  foundUser: User | null = null;
  selectedRole: 'User' | 'Critic' = 'User';
  
  isSearching = false;
  isUpdating = false;
  error = '';
  successMessage = '';

  async handleSearch() {
    if (!this.searchEmail) return;
    this.isSearching = true;
    this.error = '';
    this.successMessage = '';
    this.foundUser = null;

    try {
      this.foundUser = await this.usersService.searchUser(this.searchEmail);
      this.selectedRole = (this.foundUser.role === 'Critic' ? 'Critic' : 'User');
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Usuario no encontrado';
    } finally {
      this.isSearching = false;
    }
  }

  async handleUpdateRole() {
    if (!this.foundUser || this.selectedRole === this.foundUser.role) return;
    
    this.isUpdating = true;
    this.error = '';
    this.successMessage = '';

    try {
      const updatedUser = await this.usersService.changeRole(this.foundUser.user_id, this.selectedRole as UserRole);
      this.foundUser = updatedUser;
      this.selectedRole = (updatedUser.role === 'Critic' ? 'Critic' : 'User');
      this.successMessage = 'Rol actualizado exitosamente';
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Error al actualizar el rol';
    } finally {
      this.isUpdating = false;
    }
  }
}
