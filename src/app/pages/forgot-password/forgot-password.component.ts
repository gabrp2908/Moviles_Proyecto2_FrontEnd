import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  isLoading = false;
  error = '';

  async onSubmit() {
    this.isLoading = true;
    this.error = '';
    
    try {
      await this.auth.forgetPassword(this.email);
      alert('Código enviado a tu correo. Revisa tu bandeja de entrada.');
      this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Error al solicitar recuperación';
    } finally {
      this.isLoading = false;
    }
  }
}
