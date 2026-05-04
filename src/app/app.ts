  import { Component, signal } from '@angular/core';
  import { RouterOutlet } from '@angular/router';
  import { trigger, transition, style, animate } from '@angular/animations';
  import { Navbar } from './components/navbar/navbar';
  import { Footer } from './components/footer/footer';

  @Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navbar, Footer],
    templateUrl: './app.html',
    styleUrl: './app.css',
    animations: [
      trigger('routeAnimation', [
        transition(':increment, :decrement', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
  })
  export class App {
    protected readonly title = signal('frontend');
  }