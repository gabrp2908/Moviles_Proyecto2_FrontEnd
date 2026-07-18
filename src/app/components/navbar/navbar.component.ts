import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Shield, User as UserIcon } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/types';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class NavbarComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;
  isMenuOpen = false;

  readonly ShieldIcon = Shield;
  readonly UserIcon = UserIcon;

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  getDisplayName(value: string | null | undefined, maxLength = 16): string {
    if (!value) {
      return '';
    }

    const trimmed = value.slice(0, maxLength).replace(/\s+$/g, '');
    return value.length > maxLength ? `${trimmed}…` : value;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  async handleLogout() {
    this.closeMenu();
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}
