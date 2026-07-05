import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { IonicStorageModule } from '@ionic/storage-angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LucideAngularModule, Shield, User, Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Star, Award, Pencil, Trash2, ArrowUpDown } from 'lucide-angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    NavbarComponent,
    LucideAngularModule.pick({ Shield, User, Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Star, Award, Pencil, Trash2, ArrowUpDown })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
