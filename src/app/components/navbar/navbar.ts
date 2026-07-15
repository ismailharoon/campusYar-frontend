import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, inject } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, transform: 'translateY(-6px)' }),
        animate('200ms ease', style({ height: '*', opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('160ms ease', style({ height: 0, opacity: 0, transform: 'translateY(-6px)' }))
      ])
    ])
  ]
})
export class Navbar {
  private readonly authService = inject(AuthService);
  isScrolled = false;
  guidesOpen = false;
  mobileMenuOpen = false;

  private lastScrollY = 0;
  private navHidden = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  @HostBinding('class.nav-hidden')
  get isNavHidden(): boolean {
    // If mobile menu is open, don't hide the navbar on scroll
    return this.navHidden && !this.mobileMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollY = window.scrollY;
    this.isScrolled = currentScrollY > 50;

    if (currentScrollY > this.lastScrollY && currentScrollY > 80) {
      // Scrolling DOWN & past threshold → hide
      this.navHidden = true;
    } else {
      // Scrolling UP → show
      this.navHidden = false;
    }

    this.lastScrollY = currentScrollY;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.guidesOpen) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    if (target.closest('.guides-dropdown') || target.closest('.guides-toggle')) {
      return;
    }

    this.closeGuides();
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.guidesOpen) {
      this.closeGuides();
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleGuides(event: Event): void {
    event.stopPropagation();
    this.guidesOpen = !this.guidesOpen;
  }

  closeGuides(): void {
    this.guidesOpen = false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.closeGuides();
  }
}
