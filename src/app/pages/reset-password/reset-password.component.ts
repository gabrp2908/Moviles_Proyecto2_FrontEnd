import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  
  step = 1; // 1: Verify token, 2: New password
  isLoading = false;
  error = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async verifyToken() {
    if (!this.token) return;
    this.isLoading = true;
    this.error = '';

    try {
      await this.auth.verifyReset(this.email, this.token);
      this.step = 2;
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Código inválido o expirado';
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      await this.auth.resetPassword({ email: this.email, token: this.token, newPassword: this.newPassword });
      alert('Contraseña restablecida exitosamente');
      this.router.navigate(['/login']);
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Error al restablecer la contraseña';
    } finally {
      this.isLoading = false;
    }
  }
}
