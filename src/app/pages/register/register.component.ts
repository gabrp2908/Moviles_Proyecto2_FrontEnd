import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  isLoading = false;
  error = '';

  async onSubmit() {
    this.isLoading = true;
    this.error = '';

    if (!this.password.trim()) {
      this.error = 'La contraseña no puede ser solo espacios en blanco.';
      this.isLoading = false;
      return;
    }
    
    try {
      await this.auth.register({ name: this.name, email: this.email, password: this.password });
      alert('Registro exitoso, ahora inicia sesión');
      this.router.navigate(['/login']);
    } catch (e: any) {
      this.error = e.error?.message || e.message || 'Error al registrarse';
    } finally {
      this.isLoading = false;
    }
  }
}
