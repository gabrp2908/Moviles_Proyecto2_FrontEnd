import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  error = '';

  async onSubmit() {
    this.isLoading = true;
    this.error = '';
    
    try {
      await this.auth.login({ email: this.email, password: this.password });
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Error al iniciar sesión';
    } finally {
      this.isLoading = false;
    }
  }
}
