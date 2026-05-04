import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'campusyar_logged_in';
  private readonly loggedInSignal = signal(this.readFromStorage());

  isLoggedIn(): boolean {
    return this.loggedInSignal();
  }

  login(): void {
    this.loggedInSignal.set(true);
    sessionStorage.setItem(this.storageKey, 'true');
  }

  logout(): void {
    this.loggedInSignal.set(false);
    sessionStorage.removeItem(this.storageKey);
  }

  private readFromStorage(): boolean {
    return sessionStorage.getItem(this.storageKey) === 'true';
  }
}
