import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  private platform = inject(Platform);
  private router = inject(Router);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.platform.backButton.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const currentUrl = this.router.url;
      const canGoBack = window.history.length > 1;
      const isRootRoute = currentUrl === '/' || currentUrl === '/login' || currentUrl === '/register';

      if (!isRootRoute) {
        this.location.back();
        return;
      }

      if (canGoBack) {
        this.location.back();
      } else if (this.platform.is('capacitor')) {
        void App.exitApp();
      }
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      window.location.reload();
    }, 250);

    event?.target?.complete?.();
  }
}
